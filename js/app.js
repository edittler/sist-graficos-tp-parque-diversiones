var gl; // A global variable for the WebGL context
var glProgram;
var my_grid = null;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var t = 0.0;

function start() {
	var canvas = document.getElementById("glcanvas");

	gl = initWebGL(canvas); // Initialize the GL context

	// Only continue if WebGL is available and working

	if (gl) {
		setupWebGL(canvas);
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
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {}

	// If we don't have a GL context, give up now
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		gl = null;
	}

	return gl;
}

function setupWebGL(canvas) {
	// Set canvas size
	gl.canvas.width = window.innerWidth - 1;
	gl.canvas.height = window.innerHeight - 4;
	gl.viewport(0, 0, canvas.width, canvas.height);

	// Set the clear color
	gl.clearColor(0.1, 0.1, 0.2, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
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
	my_grid = new VertexGrid(3, 3);
	my_grid.createTerrainPlaneGrid();
	my_grid.createIndexBuffer();
	my_grid.setupWebGLBuffers();
}

function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var u_proj_matrix = gl.getUniformLocation(glProgram, "uPMatrix");
	// Preparamos una matriz de perspectiva.
	mat4.perspective(pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
	gl.uniformMatrix4fv(u_proj_matrix, false, pMatrix);

	var u_model_view_matrix = gl.getUniformLocation(glProgram, "uMVMatrix");
	// Preparamos una matriz de modelo+vista.
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -10.0]);
	mat4.rotate(mvMatrix, mvMatrix, t, [0.0, 1.0, 0.0]);
	t = t + 0.01;
	t = t + 0.01;

	gl.uniformMatrix4fv(u_model_view_matrix, false, mvMatrix);

	my_grid.drawVertexGrid();
}

function tick() {
	requestAnimationFrame(tick);
	drawScene();
	//animate();
}
