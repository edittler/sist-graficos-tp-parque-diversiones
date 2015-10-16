/*
 * Obtiene el src GLSL y compila el shader
 */
function Shader(src, type) {
	this.type = type; // vertex o fragment
	this.src = src; // codigo fuente del shader
}

Shader.Type = Object.freeze({
	VERTEX: 0,
	FRAGMENT: 1
});


// Método estático
Shader.obtainSrcFromHtmlElement = function (id) {
	var shaderScript, currentChild;

	// Obtenemos el elemento <script> que contiene el código fuente del shader.
	shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	// Extraemos el contenido de texto del <script>.
	var src = "";
	currentChild = shaderScript.firstChild;
	while (currentChild) {
		if (currentChild.nodeType == currentChild.TEXT_NODE) {
			src += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}

	return src;
};

Shader.prototype.compile = function (gl) {
	var shader;

	// Creamos un shader WebGL según el tipo.
	if (this.type == Shader.Type.FRAGMENT) {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (this.type == Shader.Type.VERTEX) {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	// Le decimos a WebGL que vamos a usar el texto como fuente para el shader.
	gl.shaderSource(shader, this.src);

	// Compilamos el shader.
	gl.compileShader(shader);

	// Chequeamos y reportamos si hubo algún error.
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling the shaders: " +
			gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
};
