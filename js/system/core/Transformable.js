/*
 * Objeto transformable en el espacio
 */

function Transformable() {
	this.objectMatrix = mat4.create(); // matriz de transformaciones al objeto
	this.resetTransformations();
}

Transformable.prototype.translate = function (x, y, z) {
	var m = mat4.create();
	mat4.translate(m, m, [x, y, z]);
	this.applyTransformationMatrix(m, false);
};

Transformable.prototype.translateX = function (x) {
	this.translate(x, 0, 0);
};

Transformable.prototype.translateY = function (y) {
	this.translate(0, y, 0);
};

Transformable.prototype.translateZ = function (z) {
	this.translate(0, 0, z);
};

Transformable.prototype.rotate = function (rad, axis) {
	var m = mat4.create();
	mat4.rotate(m, m, rad, axis);
	this.applyTransformationMatrix(m, false);
};

Transformable.prototype.rotateX = function (rad) {
	this.rotate(rad, [1, 0, 0]);
};

Transformable.prototype.rotateY = function (rad) {
	this.rotate(rad, [0, 1, 0]);
};

Transformable.prototype.rotateZ = function (rad) {
	this.rotate(rad, [0, 0, 1]);
};

Transformable.prototype.setPosition = function (x, y, z) {
	this.resetTransformations();
	this.translate(x, y, z);
};

Transformable.prototype.scale = function (factor) {
	var m = mat4.create();
	mat4.scale(m, m, [factor, factor, factor]);
	this.applyTransformationMatrix(m, false);
};

Transformable.prototype.scaleNonUniform = function (x, y, z) {
	var m = mat4.create();
	mat4.scale(m, m, [x, y, z]);
	this.applyTransformationMatrix(m, false);
};

Transformable.prototype.applyTransformationMatrix = function (matrix, reset) {
	// Por defecto resetea transformaciones anteriores
	if (!Utils.isDefined(reset) || reset == true) {
		this.resetTransformations();
	}
	// Siempre multiplica a izquierda
	mat4.multiply(this.objectMatrix, this.objectMatrix, matrix);
};

Transformable.prototype.resetTransformations = function () {
	mat4.identity(this.objectMatrix);
};

Transformable.prototype.getObjectMatrix = function () {
	return this.objectMatrix;
};

Transformable.prototype.getPosition = function () {
	// Obtiene la posicion a partir de la matriz de transformaciones
	var v = vec3.create();
	var inverse = mat4.create();
	mat4.invert(inverse, this.objectMatrix);
	vec3.transformMat4(v, v, inverse);
	vec3.negate(v, v);
	return v;
};
