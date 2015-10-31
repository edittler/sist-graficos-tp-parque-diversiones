/*
 * Modelo transformable y renderizable como parte de una escena
 */
function Model() {
	this.parent; // modelo padre

	this.initialized; // informa si está listo para renderizarse

	Transformable.call(this);

	this.setInitialized(false);
}

Model.prototype = Object.create(Transformable.prototype);
Model.prototype.constructor = Model;

// Métodos públicos
Model.prototype.setInitialized = function (state) {
	this.initialized = state;

	if (state === false && Utils.isDefined(this.parent)) {
		this.parent.setInitialized(false);
	}
};

Model.prototype.isInitialized = function () {
	return this.initialized;
};

// Métodos abstractos
Model.prototype.prepareToRender = function (gl) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Model.prototype.setRenderMatrixes = function (mMatrix, vMatrix, pMatrix) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Model.prototype.setLights = function (gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Model.prototype.draw = function (gl) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Model.prototype.callUpdate = function (obj, elapsedTime) {
	obj.update.call(this, elapsedTime);
};

Model.prototype.update = function (elapsedTime) { // jshint ignore:line
	// Se llama en cada ciclo
};
