/*
 * ShaderProgram básico con color sin iluminación
 */
function BasicColorSP() {
	ShaderProgram.call(this);

	var vs = Shader.obtainSrcFromHtmlElement("basico-vs");
	var fs = Shader.obtainSrcFromHtmlElement("basico-fs");

	this.setSource(vs, fs);
}

BasicColorSP.prototype = Object.create(ShaderProgram.prototype);

BasicColorSP.prototype.constructor = BasicColorSP;

// @override
BasicColorSP.prototype.init = function (gl) {
	ShaderProgram.prototype.init.call(this, gl);

	this.locateUniform(gl, "uPMatrix");
	this.locateUniform(gl, "uMVMatrix");

	this.locateAttribute(gl, "aVertexPosition");
	this.locateAttribute(gl, "aVertexColor");
};
