/*
 * Material que recubre un modelo. Tiene un shader asociado.
 */
function Material() {
	this.supportsLight = true; // flag para saber si el shader soporta iluminacion
	this.shininess = 10.0;

	this.cubeMap = null; // Cubic Reflection Map
	this.usingCubeMap = false;
	this.reflectionFactor = 1.0;

	this.vertexMapping = []; // mapeo del color o de la textura a los vertices
}
Material.prototype.setLightSupport = function (support) {
	this.supportsLight = support;
};

Material.prototype.hasLightSupport = function () {
	return this.supportsLight;
};

Material.prototype.setCubeMap = function (imgSrcs, refFactor) {
	this.cubeMap = new CubeMap(imgSrcs);
	this.usingCubeMap = true;
	this.reflectionFactor = refFactor;
};

Material.prototype.isUsingCubeMap = function () {
	return Utils.isDefined(this.cubeMap);
};

Material.prototype.getReflectionFactor = function () {
	return this.reflectionFactor;
};

Material.prototype.getShininess = function () {
	return this.shininess;
};

Material.prototype.setShininess = function (shininess) {
	this.shininess = shininess;
};

Material.prototype.prepareMaterial = function (gl) {
	// Este método será llamado en el momento de la
	// inicialización del material

	if (this.isUsingCubeMap()) {
		this.cubeMap.init(gl);
	}
};

Material.prototype.drawMaterial = function (gl) {
	// Este método será llamado en el momento del
	// dibujado del material

	if (this.isUsingCubeMap()) {
		this.cubeMap.bind(gl, gl.TEXTURE3);
	}
};

Material.prototype.generateMappings = function (levels, faces) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Material.prototype.getColorMappings = function () {
	console.error("Error: Abstract method not implemented");
};

Material.prototype.getTextureMappings = function () {
	console.error("Error: Abstract method not implemented");
};

Material.prototype.getShaderProgram = function () {
	console.error("Error: Abstract method not implemented");
};
