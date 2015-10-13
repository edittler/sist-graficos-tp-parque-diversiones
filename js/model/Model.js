/*
 * Modelo transformable y renderizable como parte de una escena
 */

function Model() {
	this.parent; // modelo padre

	this.initialized; // informa si está listo para renderizarse

	Transformable.prototype.constructor.call(this);

	this.setInitialized(false);
}

Model.prototype = Object.create(Transformable.prototype);

Model.prototype.constructor = Model;

// Métodos públicos
Model.prototype.setInitialized = function (state) {
	this.initialized = state;

	if (state == false && Utils.isDefined(this.parent)) {
		this.parent.setInitialized(false);
	}
};

Model.prototype.isInitialized = function () {
	return this.initialized;
};

// Métodos abstractos
Model.prototype.prepareToRender = function (gl) {
	alert("Error: Abstract method not implemented");
};

Model.prototype.setRenderMatrixes = function (mMatrix, vMatrix, pMatrix) {
	alert("Error: Abstract method not implemented");
};

Model.prototype.setLights = function (gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos) {
	alert("Error: Abstract method not implemented");
};

Model.prototype.draw = function (gl) {
	alert("Error: Abstract method not implemented");
};

Model.prototype.callUpdate = function (obj) {
	obj.update.call(this);
};

Model.prototype.update = function () {
	// Se llama en cada ciclo
};
