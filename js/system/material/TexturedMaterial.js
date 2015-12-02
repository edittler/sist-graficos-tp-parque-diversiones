/*
 * Material con textura
 */
function TexturedMaterial(imgSrc) {
	Material.call(this);
	this.texture = new Texture(imgSrc);
	this.lightMap = null;
	this.normalMap = null; // Bump Map

	this.transforms = mat3.create(); // matriz de transformaciones 2d
	this.mosaic = [true, true]; // coordenadas <0 y >1 repiten la textura

	this.usingLightMap = false;
	this.usingNormalMap = false;

	this.lightMapFactor;
}

TexturedMaterial.prototype = Object.create(Material.prototype);
TexturedMaterial.prototype.constructor = TexturedMaterial;

TexturedMaterial.prototype.setTexture = function (texture) {
	this.texture = texture;
};

TexturedMaterial.prototype.isUsingLightMap = function () {
	return Utils.isDefined(this.lightMap);
};

TexturedMaterial.prototype.isUsingNormalMap = function () {
	return Utils.isDefined(this.normalMap);
};

TexturedMaterial.prototype.setLightMap = function (imgSrc, factor) {
	this.lightMap = new Texture(imgSrc);
	this.lightMapFactor = factor;
	this.usingLightMap = true;
};

TexturedMaterial.prototype.setNormalMap = function (imgSrc) {
	this.normalMap = new Texture(imgSrc);
	this.usingNormalMap = true;
};

TexturedMaterial.prototype.setTextureMappings = function (texcoords) {
	this.vertexMapping = texcoords;
};

TexturedMaterial.prototype.mosaic = function (u, v) {
	this.mosaic = [u, v];
};

TexturedMaterial.prototype.rotate = function (rad) {
	mat3.rotate(this.transforms, this.transforms, rad);
};

TexturedMaterial.prototype.translate = function (u, v) {
	var vec = vec2.fromValues(u, v);
	mat3.translate(this.transforms, this.transforms, vec);
};

TexturedMaterial.prototype.scale = function (u, v) {
	var vec = vec2.fromValues(u, v);
	mat3.scale(this.transforms, this.transforms, vec);
};

// @override
TexturedMaterial.prototype.prepareMaterial = function (gl) {
	Material.prototype.prepareMaterial.call(this, gl);

	this.texture.init(gl, this.mosaic);
	if (this.isUsingLightMap()) {
		this.lightMap.init(gl, this.mosaic);
	}
	if (this.isUsingNormalMap()) {
		this.normalMap.init(gl, this.mosaic);
	}
};

// @override
TexturedMaterial.prototype.drawMaterial = function (gl) {
	Material.prototype.drawMaterial.call(this, gl);

	this.texture.bind(gl, gl.TEXTURE0);
	if (this.isUsingLightMap()) {
		this.lightMap.bind(gl, gl.TEXTURE1);
	}
	if (this.isUsingNormalMap()) {
		this.normalMap.bind(gl, gl.TEXTURE2);
	}
};

// @override
TexturedMaterial.prototype.generateMappings = function (levels, faces) {
	if (this.vertexMapping.length === 0) {
		for (var n = 0; n < levels; n++) {
			for (var c = 0; c < faces; c++) {
				var u = n / (levels - 1);
				var v = c / (faces - 1);

				var vec = vec2.fromValues(u, v);
				vec2.transformMat3(vec, vec, this.transforms);
				this.vertexMapping = this.vertexMapping.concat([vec[0], vec[1]]);
			}
		}
	}
};

// @override
TexturedMaterial.prototype.getColorMappings = function () {
	return []; // devuelve un array vacio
};

// @override
TexturedMaterial.prototype.getTextureMappings = function () {
	return this.vertexMapping;
};

// @override
TexturedMaterial.prototype.getShaderProgram = function () {
	if (this.supportsLight) {
		return new LightAndTextureSP();
	} else {
		return new BasicTextureSP();
	}
};
