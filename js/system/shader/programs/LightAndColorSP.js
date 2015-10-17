/*
 * ShaderProgram con iluminación y color
 */
function LightAndColorSP() {
	ShaderProgram.call(this);

	var vs = Shader.obtainSrcFromHtmlElement("conIluminacion-vs");
	var fs = Shader.obtainSrcFromHtmlElement("conIluminacion-fs");

	this.setSource(vs, fs);
}

LightAndColorSP.prototype  = Object.create(ShaderProgram.prototype);

LightAndColorSP.prototype.constructor = LightAndColorSP;

// @override
LightAndColorSP.prototype.init = function (gl) {
	ShaderProgram.prototype.init.call(this, gl);

	this.locateUniform(gl, "uPMatrix");
	this.locateUniform(gl, "uMVMatrix");

	this.locateAttribute(gl, "aVertexPosition");
	this.locateAttribute(gl, "aVertexNormal");
	this.locateAttribute(gl, "aVertexTangent");
	this.locateAttribute(gl, "aVertexColor");

	this.locateUniform(gl, "uNMatrix");
	this.locateUniform(gl, "uUseLighting");
	this.locateUniform(gl, "uAmbientColor");
	this.locateUniform(gl, "uDirectionalColor");
	this.locateUniform(gl, "uLightPosition");

	this.locateUniform(gl, "uCarLightTransformedPosition");
	this.locateUniform(gl, "uCarLightTransformedDirection");
	this.locateUniform(gl, "uCarLightColor");
	this.locateUniform(gl, "uCameraPos");

	this.locateUniform(gl, "uShininess");
};
