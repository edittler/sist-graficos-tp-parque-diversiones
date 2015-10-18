/*
 * Modelo simple con buffers y shaders asociados. Es un único poliedro.
 * Está definido por una geometría y un material que lo recubre.
 */
function PrimitiveModel(geometry, material, auto) {
	Model.call(this);

	this.shaderProgram;

	this.renderMatrixes; // Model, View y Projection
	this.renderModeId; // modo de renderizado del index buffer

	this.geometry;
	this.material;

	this.vertexBuffer;
	this.indexBuffer;
	this.normalBuffer;
	this.tangentBuffer;
	this.colorBuffer;
	this.textureBuffer;

	this.init(geometry, material);
}

PrimitiveModel.prototype = Object.create(Model.prototype);
PrimitiveModel.prototype.constructor = PrimitiveModel;

PrimitiveModel.RenderMode = Object.freeze({
	TRIANGLE_STRIP: 0,
	TRIANGLE_FAN: 1,
	LINES: 2,
	LINE_STRIP: 3
});

PrimitiveModel.prototype.initBuffers = function (gl) {
	this.vertexBuffer = new AttributeBuffer(gl);
	this.vertexBuffer.setData(3, this.geometry.getVertices());

	this.indexBuffer = new IndexBuffer(gl);
	this.indexBuffer.setData(this.geometry.getIndexes());

	this.normalBuffer = new AttributeBuffer(gl);
	this.normalBuffer.setData(3, this.geometry.getNormals());

	this.tangentBuffer = new AttributeBuffer(gl);
	this.tangentBuffer.setData(3, this.geometry.getTangents());

	this.colorBuffer = new AttributeBuffer(gl);
	this.colorBuffer.setData(4, this.material.getColorMappings());

	this.textureBuffer = new AttributeBuffer(gl);
	this.textureBuffer.setData(2, this.material.getTextureMappings());
};

PrimitiveModel.prototype.getGlRenderMode = function (gl) {
	switch (this.renderModeId) {
	case PrimitiveModel.RenderMode.TRIANGLE_STRIP:
		return gl.TRIANGLE_STRIP;
	case PrimitiveModel.RenderMode.TRIANGLE_FAN:
		return gl.TRIANGLE_FAN;
	case PrimitiveModel.RenderMode.LINES:
		return gl.LINES;
	case PrimitiveModel.RenderMode.LINE_STRIP:
		return gl.LINE_STRIP;
	default:
		return gl.TRIANGLE_STRIP;
	}
};

PrimitiveModel.prototype.setRenderMode = function (rm) {
	this.renderModeId = rm;
};

PrimitiveModel.prototype.init = function (geometry, material) {
	if (Utils.isDefined(geometry) && Utils.isDefined(material)) {
		this.renderMatrixes = [];
		this.geometry = geometry;
		this.material = material;
		this.dir = vec3.create();
		this.geometry.prepareGeometry();

		// genera los atributos de color o textura según el caso
		var levels = this.geometry.levels;
		var faces = this.geometry.faces;
		this.material.genetareMappings(levels, faces);

		// obtiene el shader program a utilizar
		this.shaderProgram = this.material.getShaderProgram();
	}
};

// @override
PrimitiveModel.prototype.prepareToRender = function (gl) {
	this.shaderProgram.init(gl);
	this.material.prepareMaterial(gl);
	this.initBuffers(gl);
	this.setInitialized(true);
};

// @override
PrimitiveModel.prototype.setRenderMatrixes = function (mMatrix, vMatrix, pMatrix) {
	this.renderMatrixes.model = mat4.clone(mMatrix);
	this.renderMatrixes.view = mat4.clone(vMatrix);
	this.renderMatrixes.projection = mat4.clone(pMatrix);
};

// @override
PrimitiveModel.prototype.setLights = function (gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection) {
	this.shaderProgram.useThisProgram(gl);

	var useLight = this.material.hasLightSupport();
	gl.uniform1i(this.shaderProgram.getUniform("uUseLighting"), useLight);
	gl.uniform1f(this.shaderProgram.getUniform("uShininess"), this.material.getShininess());
	gl.uniform3f(this.shaderProgram.getUniform("uAmbientColor"), amb, amb, amb);
	gl.uniform3f(this.shaderProgram.getUniform("uDirectionalColor"), dir, dir, dir);
	gl.uniform3fv(this.shaderProgram.getUniform("uLightPosition"), pos);

	gl.uniform3f(this.shaderProgram.getUniform("uCarLightColor"), carLightColor, carLightColor, carLightColor);
	gl.uniform3fv(this.shaderProgram.getUniform("uCarLightTransformedPosition"), transformedCarLight);
	gl.uniform3fv(this.shaderProgram.getUniform("uCarLightTransformedDirection"), transformedCarLightDirection);

	gl.uniform1i(this.shaderProgram.getUniform("uUsingLightMap"), this.material.usingLightMap);

	gl.uniform1f(this.shaderProgram.getUniform("uLightMapFactor"), this.material.lightMapFactor);

	gl.uniform1i(this.shaderProgram.getUniform("uUsingNormalMap"), this.material.usingNormalMap);

	gl.uniform1f(this.shaderProgram.getUniform("uReflectionFactor"), this.material.getReflectionFactor());
	gl.uniform1i(this.shaderProgram.getUniform("uUsingReflectionMap"), this.material.usingCubeMap);
};

// @override
PrimitiveModel.prototype.draw = function (gl) {
	var matrixes = this.renderMatrixes;

	// Obtiene las matrices de una rama del Arbol de la Escena
	var sceneTwig = [this.objectMatrix];
	var parent = this.parent;
	while (Utils.isDefined(parent)) {
		sceneTwig.push(parent.objectMatrix);
		parent = parent.parent;
	}

	// Obtiene la matriz Model-View
	var mvMatrix = mat4.create();
	mat4.multiply(mvMatrix, matrixes.view, matrixes.model);

	// Multiplica las matrices en el orden correcto
	for (var i = sceneTwig.length - 1; i >= 0; i--) {
		mat4.multiply(mvMatrix, mvMatrix, sceneTwig[i]);
	}

	// Setea el programa de shaders dinámicamente para cada modelo
	var program = this.shaderProgram;
	program.useThisProgram(gl);

	// asocio la pMatrix con la del shader
	gl.uniformMatrix4fv(program.getUniform("uPMatrix"), 0, matrixes.projection);

	// asocio la mvMatrix con la del shader
	gl.uniformMatrix4fv(program.getUniform("uMVMatrix"), 0, mvMatrix);

	// calculo y asocio la nMatrix con la del shader
	var nMatrix = mat3.create();
	mat3.normalFromMat4(nMatrix, mvMatrix);
	gl.uniformMatrix3fv(program.getUniform("uNMatrix"), 0, nMatrix);

	// Asociamos un atributo del shader con cada uno de los buffers que creamos
	program.associateAttribute(this.vertexBuffer, "aVertexPosition");
	program.associateAttribute(this.normalBuffer, "aVertexNormal");
	program.associateAttribute(this.tangentBuffer, "aVertexTangent");
	program.associateAttribute(this.colorBuffer, "aVertexColor");
	program.associateAttribute(this.textureBuffer, "aTextureCoord");

	// hago un bind de la textura antes de dibujarla
	this.material.drawMaterial(gl);
	gl.uniform1i(program.getUniform("uSampler"), 0);
	gl.uniform1i(program.getUniform("uSamplerLightMap"), 1);
	gl.uniform1i(program.getUniform("uSamplerNormalMap"), 2);
	gl.uniform1i(program.getUniform("uReflectionMap"), 3);

	// Dibujamos el modelo
	this.indexBuffer.draw(this.getGlRenderMode(gl));
};
