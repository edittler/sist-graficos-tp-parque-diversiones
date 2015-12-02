/*
 * Material con color
 */
function ColoredMaterial(color) {
	Material.call(this);
	this.color = color;
}

ColoredMaterial.prototype = Object.create(Material.prototype);

ColoredMaterial.prototype.constructor = ColoredMaterial;

ColoredMaterial.prototype.setColor = function (color) {
	this.color = color;
};

ColoredMaterial.prototype.setColorMappings = function (colors) {
	this.vertexMapping = colors;
};

// @override
ColoredMaterial.prototype.generateMappings = function (levels, faces) {
	if (this.vertexMapping.length === 0) {
		for (var c = 0; c < levels * faces; c++) {
			this.vertexMapping = this.vertexMapping.concat(this.color);
		}
	}
};

// @override
ColoredMaterial.prototype.getColorMappings = function () {
	return this.vertexMapping;
};

// @override
ColoredMaterial.prototype.getTextureMappings = function () {
	return []; // devuelve un array vacio
};

// @override
ColoredMaterial.prototype.getShaderProgram = function () {
	if (this.supportsLight) {
		return new LightAndColorSP();
	} else {
		return new BasicColorSP();
	}
};
