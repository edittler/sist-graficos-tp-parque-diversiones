var gl; // A global variable for the WebGL context
var glProgram; // Programa WebGL que manipula los shaders
var mvMatrix = mat4.create(); // Matriz de modelo-vista
var mvMatrixStack = []; // Pila que almacena los estados de matriz modelo-vista
var pMatrix = mat4.create(); // Matriz de proyección
var lastTime = 0; // Tiempo de la última vez que se ejecutó la animación
var my_grid = null;

function start() {
	var canvas = document.getElementById("glcanvas");

	gl = initWebGL(canvas); // Initialize the GL context

	// Only continue if WebGL is available and working
	if (gl) {
		setupWebGL();
		initShaders();
		setupBuffers();
		tick();
	}
}

function initWebGL(canvas) {
	gl = null;

	try {
		// Try to grab the standard context. If it fails, fallback to experimental.
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch (e) {}

	// If we don't have a GL context, give up now
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		gl = null;
	}

	return gl;
}

function setupWebGL() {
	// Set canvas size
	gl.canvas.width = window.innerWidth - 1;
	gl.canvas.height = window.innerHeight - 4;

	// Set the clear color
	gl.clearColor(0.1, 0.1, 0.2, 1.0);
}

// SHADERS FUNCTION
function getShader(gl, id) {
	var shaderScript, src, currentChild, shader;

	// Obtenemos el elemento <script> que contiene el código fuente del shader.
	shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	// Extraemos el contenido de texto del <script>.
	src = "";
	currentChild = shaderScript.firstChild;
	while (currentChild) {
		if (currentChild.nodeType == currentChild.TEXT_NODE) {
			src += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}

	// Creamos un shader WebGL según el atributo type del <script>.
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	// Le decimos a WebGL que vamos a usar el texto como fuente para el shader.
	gl.shaderSource(shader, src);

	// Compilamos el shader.
	gl.compileShader(shader);

	// Chequeamos y reportamos si hubo algún error.
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling the shaders: " +
			gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function initShaders() {
	// Obtenemos los shaders ya compilados
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	// Creamos un programa de shaders de WebGL.
	glProgram = gl.createProgram();

	// Asociamos cada shader compilado al programa.
	gl.attachShader(glProgram, vertexShader);
	gl.attachShader(glProgram, fragmentShader);

	// Linkeamos los shaders para generar el programa ejecutable.
	gl.linkProgram(glProgram);

	// Chequeamos y reportamos si hubo algún error.
	if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program: " +
			gl.getProgramInfoLog(glProgram));
		return null;
	}

	// Le decimos a WebGL que de aquí en adelante use el programa generado.
	gl.useProgram(glProgram);
}

function setupBuffers() {
	my_grid = new VertexGrid(10, 10);
	my_grid.createTerrainPlaneGrid();
	my_grid.createIndexBuffer();
	my_grid.setupWebGLBuffers();
}

/*
 * Función para almacenar una copia de la matriz de modelo-vista en el stack.
 * Utilizada para almanenar estados intermedios al dibujar múltiples objetos.
 */
function mvPushMatrix() {
	var copy = mat4.clone(mvMatrix);
	mvMatrixStack.push(copy);
}

/*
 * Función para restaurar la copia anterior de la matriz de modelo-vista
 * almacenada en el stack.
 */
function mvPopMatrix() {
	if (mvMatrixStack.length === 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
	var u_proj_matrix = gl.getUniformLocation(glProgram, "uPMatrix");
	gl.uniformMatrix4fv(u_proj_matrix, false, pMatrix);
	var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
	gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix);
}

function drawScene() {
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Preparamos una matriz de perspectiva.
	mat4.perspective(pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

	// Preparamos una matriz de modelo+vista.
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -10.0]);

	my_grid.draw();
}

/*
 * Función que calcula el tiempo delta.
 * El tiempo delta consiste en determinar el número de milisegundos
 * transcurridos desde la última ejecución de la función animate, y mover
 * los objetos en consecuencia según la velocidad por segundo que nosotros
 * le hayamos dicho que tienen.
 * Con el método de tiempo delta, nos aseguramos a que el objeto siempre
 * mantenga una velocidad de animación constante, y que se vea igual en toda
 * clase de ordenadores lentos o rápidos (siempre que tengan un mínimo
 * de potencia para mover webgl con cierta fluidez, claro).
 */
function animate() {
	var timeNow = new Date().getTime();
	if (lastTime !== 0) {
		var elapsed = timeNow - lastTime;

		my_grid.animate(elapsed);
	}
	lastTime = timeNow;
}

/*
 * Función que ejecuta la animación.
 * Hace uso de la función requestAnimationFrame que notifica al navegador
 * que debe volver a pintar la escena webGL.
 * Se podría conseguir un efecto similar al uso de requestAnimFrame,
 * pidiéndole que sea javascript el que llame a la función drawScene
 * con regularidad.
 * Dado que el setInterval de javascript se ejecuta esté la pestaña abierta
 * o no, ésto supone un increíble desperdicio de rendimiento, que podría
 * acabar perjudicando a la velocidad de ejecución de los javascripts.
 * Sin embargo, requestAnimFrame sólo se llama cuando el canvas donde
 * se dibuja la escene está visible.
 */
function tick() {
	requestAnimationFrame(tick);
	drawScene();
	animate();
}