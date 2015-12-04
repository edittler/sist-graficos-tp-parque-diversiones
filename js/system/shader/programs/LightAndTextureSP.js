/*
 *  ShaderProgram con iluminación y textura
 */
function LightAndTextureSP() {
	ShaderProgram.call(this);

	var vs = Shader.obtainSrcFromHtmlElement("conIluminacionYTextura-vs");
	var fs = Shader.obtainSrcFromHtmlElement("conIluminacionYTextura-fs");

	this.setSource(vs, fs);
}

LightAndTextureSP.prototype = Object.create(ShaderProgram.prototype);
LightAndTextureSP.prototype.constructor = LightAndTextureSP;

// @override
LightAndTextureSP.prototype.init = function (gl) {
	ShaderProgram.prototype.init.call(this, gl);

	this.locateUniform(gl, "uPMatrix");
	this.locateUniform(gl, "uMVMatrix");
	this.locateUniform(gl, "uNMatrix");

	this.locateAttribute(gl, "aVertexPosition");
	this.locateAttribute(gl, "aVertexNormal");
	this.locateAttribute(gl, "aVertexTangent");
	this.locateAttribute(gl, "aTextureCoord");

	this.locateUniform(gl, "uSampler");
	this.locateUniform(gl, "uSamplerLightMap");
	this.locateUniform(gl, "uSamplerNormalMap");
	this.locateUniform(gl, "uReflectionMap");

	this.locateUniform(gl, "uAmbientColor");
	this.locateUniform(gl, "uDirectionalColor");
	this.locateUniform(gl, "uLightPosition");

	this.locateUniform(gl, "uCarLightColor");
	this.locateUniform(gl, "uCarLightTransformedPosition");
	this.locateUniform(gl, "uCarLightTransformedDirection");

	this.locateUniform(gl, "uShininess");
	this.locateUniform(gl, "uReflectionFactor");
	this.locateUniform(gl, "uUsingLightMap");
	this.locateUniform(gl, "uLightMapFactor");
	this.locateUniform(gl, "uUsingNormalMap");
	this.locateUniform(gl, "uUsingReflectionMap");

	this.locateUniform(gl, "uUseWaterEffect");
	this.locateUniform(gl, "uTime");
};
