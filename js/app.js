var glProgram; // Programa WebGL que manipula los shaders
var mvMatrix = mat4.create(); // Matriz de modelo-vista
var mvMatrixStack = []; // Pila que almacena los estados de matriz modelo-vista
var pMatrix = mat4.create(); // Matriz de proyección
var lastTime = 0; // Tiempo de la última vez que se ejecutó la animación
var my_grid = null;

var renderer, escena, piso, auto, simulador;

var camara, camaraOrbital, camaraSeguimiento, camaraPrimeraPersona;

var ambientColor, directionalColor, directionalPosition;
var spotlightColor, spotlightPosition, spotlightDirection;

function start() {
	init();
	loop();
}

function init() {
	var up = vec3.fromValues(0, 0, -1);

	var w = window.innerWidth - 1;
	var h = window.innerHeight - 4;

	renderer = new Renderer(w, h);

	// ubico el canvas del renderer en el body
	var bodyCenter = document.getElementById("canvas-container");
	bodyCenter.appendChild(renderer.getCanvasElement());

	// CREAR OBJETOS

	piso = new Piso();


	escena = new Scene();

	// habilita la iluminacion
	ambientColor = 0.1;
	directionalColor = 0.4;
	spotlightColor = 1.0;

	directionalPosition = [-600, 200, 400];
	spotlightPosition = [10.0, 0.0, 0.0];
	spotlightDirection = [1.0, 0.0, -0.7]; // TODO deberia ser -1,0,0

	//escena.setAuto(auto);
	escena.setLightSources(ambientColor, directionalColor, directionalPosition, spotlightColor, spotlightPosition, spotlightDirection);

	// AGREGAR OBJETOS A LA ESCENA

	escena.add(piso);

	var eyeSeguimiento = vec3.fromValues(-20, 0, 3);
	var targetSeguimiento = vec3.fromValues(-4, 0, 0);
	//camaraSeguimiento = new CamaraSeguimiento(auto, eyeSeguimiento, targetSeguimiento, up);

	var eyeOrbital = vec3.fromValues(0,100,20);
	var targetOrbital= vec3.fromValues(0,0,-10)
	camaraOrbital = new CamaraOrbital(w, h, eyeOrbital, targetOrbital, up);
	camara = camaraOrbital;

	var eyePP = vec3.fromValues(0,0,6);
	var targetPP= vec3.fromValues(3,0,6);
	//camaraPrimeraPersona = new CamaraPrimeraPersona(eyePP, targetPP, up);

	initShaders();
	setupBuffers();
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
	var fragmentShader = getShader(renderer.gl, "shader-fs");
	var vertexShader = getShader(renderer.gl, "shader-vs");

	// Creamos un programa de shaders de WebGL.
	glProgram = renderer.gl.createProgram();

	// Asociamos cada shader compilado al programa.
	renderer.gl.attachShader(glProgram, vertexShader);
	renderer.gl.attachShader(glProgram, fragmentShader);

	// Linkeamos los shaders para generar el programa ejecutable.
	renderer.gl.linkProgram(glProgram);

	// Chequeamos y reportamos si hubo algún error.
	if (!renderer.gl.getProgramParameter(glProgram, renderer.gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program: " +
			renderer.gl.getProgramInfoLog(glProgram));
		return null;
	}

	// Le decimos a WebGL que de aquí en adelante use el programa generado.
	renderer.gl.useProgram(glProgram);
}

function setupBuffers() {
	my_grid = new VertexGrid(renderer.gl, 10, 10);
	my_grid.createTerrainPlaneGrid();
	my_grid.createIndexBuffer();

	//caja = new Box(2.0, 2.0, 2.0, new ColoredMaterial(Color.GREY));
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
	var u_proj_matrix = renderer.gl.getUniformLocation(glProgram, "uPMatrix");
	renderer.gl.uniformMatrix4fv(u_proj_matrix, false, pMatrix);
	var u_model_view_matrix = renderer.gl.getUniformLocation(glProgram, "uMVMatrix");
	renderer.gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix);
}

function drawScene() {
	renderer.gl.viewport(0, 0, renderer.gl.canvas.width, renderer.gl.canvas.height);
	renderer.clear();
	// Preparamos una matriz de perspectiva.
	mat4.perspective(pMatrix, 45, renderer.gl.canvas.width / renderer.gl.canvas.height, 0.1, 100.0);

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
function elapsedTime() {
	var timeNow = new Date().getTime();
	var elapsed = 0;
	if (lastTime !== 0) {
		elapsed = timeNow - lastTime;
	}
	lastTime = timeNow;
	return elapsed;
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
function loop() {
	requestAnimationFrame(loop);

	var tick = elapsedTime();

	drawScene();

	//listenToKeyboard(tick);
	//listenToMouse();

	//simulador.update();
	//camaraSeguimiento.update();

	escena.update();  // actualiza todos los modelos
	//renderer.render(escena, camara.getPerspectiveCamera());
	//auto.guardarCaniones(tick);

	my_grid.animate(tick);
}
