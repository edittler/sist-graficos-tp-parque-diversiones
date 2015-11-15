/*
 * ShaderProgram con textura
 */
function BasicTextureSP() {
	ShaderProgram.call(this);

	var vs = Shader.obtainSrcFromHtmlElement("basicoTextura-vs");
	var fs = Shader.obtainSrcFromHtmlElement("basicoTextura-fs");

	this.setSource(vs, fs);
}

BasicTextureSP.prototype = Object.create(ShaderProgram.prototype);
BasicTextureSP.prototype.constructor = BasicTextureSP;

// @override
BasicTextureSP.prototype.init = function (gl) {
	ShaderProgram.prototype.init.call(this, gl);

	this.locateUniform(gl, "uPMatrix");
	this.locateUniform(gl, "uMVMatrix");

	this.locateAttribute(gl, "aVertexPosition");
	this.locateAttribute(gl, "aTextureCoord");

	this.locateUniform(gl, "uSampler");
};
