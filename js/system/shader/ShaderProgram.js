/*
 * Programa de shaders compuesto de un vertex y un fragment shader
 */
function ShaderProgram(vertexSrc, fragmentSrc) {
	this.vertexShader;
	this.fragmentShader;

	this.program; // referencia al programa linkeado

	this.assocAttributes; // hashmap con los attributes localizados
	this.assocUniforms; // hashmap con los uniforms localizados

	this.setSource(vertexSrc, fragmentSrc);
}

ShaderProgram.prototype.link = function (gl) {
	// Obtenemos los shaders ya compilados
	var vertexShader = this.vertexShader.compile(gl);
	var fragmentShader = this.fragmentShader.compile(gl);

	// Creamos un programa de shaders de WebGL.
	var shaderProgram = gl.createProgram();

	// Asociamos cada shader compilado al programa.
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	// Linkeamos los shaders para generar el programa ejecutable.
	gl.linkProgram(shaderProgram);

	// Chequeamos y reportamos si hubo algún error.
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program: " +
			gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	this.program = shaderProgram;
};

ShaderProgram.prototype.init = function (gl) {
	this.assocAttributes = [];
	this.assocUniforms = [];

	this.link(gl);
};

ShaderProgram.prototype.setSource = function (vertexSrc, fragmentSrc) {
	if (Utils.isDefined(vertexSrc) && Utils.isDefined(fragmentSrc)) {
		this.vertexShader = new Shader(vertexSrc, Shader.Type.VERTEX);
		this.fragmentShader = new Shader(fragmentSrc, Shader.Type.FRAGMENT);
	}
};

ShaderProgram.prototype.useThisProgram = function (gl) {
	gl.useProgram(this.program);
};

ShaderProgram.prototype.locateAttribute = function (gl, attr) {
	var attrIdx = gl.getAttribLocation(this.program, attr);
	if (attrIdx >= 0) {
		gl.enableVertexAttribArray(attrIdx);
		this.assocAttributes[attr] = attrIdx;
	}
};

ShaderProgram.prototype.locateUniform = function (gl, unif) {
	var unifLoc = gl.getUniformLocation(this.program, unif);
	if (Utils.isDefined(unifLoc)) {
		this.assocUniforms[unif] = unifLoc;
	}
};

ShaderProgram.prototype.getAttribute = function (attr) {
	return this.assocAttributes[attr];
};

ShaderProgram.prototype.getUniform = function (unif) {
	return this.assocUniforms[unif];
};

ShaderProgram.prototype.associateAttribute = function (buffer, attr) {
	var attribute = this.assocAttributes[attr];
	if (Utils.isDefined(attribute)) {
		buffer.associateAttrPointer(attribute);
	}
};
