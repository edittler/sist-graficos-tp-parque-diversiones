/*
 * Encapsula todo el tratamiento del contexto gl y el canvas
 */
function Renderer(w, h) {
	this.canvas;
	this.gl;

	this.initCanvas(w, h);
	this.initWebGL();
}

Renderer.prototype.initCanvas = function (w, h) {
	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	canvas.style.backgroundColor = "black";

	this.canvas = canvas;
};

Renderer.prototype.initWebGL = function () {
	var gl = null;
	var ops = {
		preserveDrawingBuffer: true
	};

	try {
		// Intentamos primero con el contexto estandar. Si falla, probamos
		// con el experimental.
		gl = this.canvas.getContext("webgl", ops) ||
			this.canvas.getContext("experimental-webgl", ops);
	} catch (e) {}

	// Si no tenemos un contexto, abortamos.
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		gl = null;
	}

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, this.canvas.width, this.canvas.height);

	this.gl = gl;
};

Renderer.prototype.getCanvasElement = function () {
	return this.canvas;
};

Renderer.prototype.getWidth = function () {
	return this.canvas.width;
};

Renderer.prototype.getHeight = function () {
	return this.canvas.height;
};

Renderer.prototype.setClearColor = function (r, g, b, alpha) {
	// color de fondo para la escena
	this.gl.clearColor(r, g, b, alpha);
};

Renderer.prototype.clear = function () {
	// Se limpia la pantalla
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

Renderer.prototype.render = function (scene, camera) {
	scene.draw(this.gl, camera);
};
