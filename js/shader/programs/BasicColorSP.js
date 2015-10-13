/*
 * ShaderProgram básico con color sin iluminación
 */
function BasicColorSP() {
	ShaderProgram.call(this);

	var vs = Shader.obtainSrcFromHtmlElement("basico-vs");
	var fs = Shader.obtainSrcFromHtmlElement("basico-fs");

	this.setSource(vs, fs);
}

// @override
BasicColorSP.prototype.init = function (gl) {
	ShaderProgram.init.call(this, gl);

	this.locateUniform.call(this, gl, "uPMatrix");
	this.locateUniform.call(this, gl, "uMVMatrix");

	this.locateAttribute.call(this, gl, "aVertexPosition");
	this.locateAttribute.call(this, gl, "aVertexColor");
};
