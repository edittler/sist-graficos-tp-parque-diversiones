/*
 * Camara abstracta de base para otras camaras
 */
function Camera() {
	Transformable.call(this);
	this.up; // vector hacia arriba
	this.target; // punto donde mira

	this.setUp(0, -1, 0);

	// mira al centro de la escena por default
	this.setTarget(0, 0, 0);
}

Camera.prototype = Object.create(Transformable.prototype);

Camera.prototype.constructor = Camera;

Camera.prototype.setUp = function (x, y, z) {
	// TODO: ver como solucionar el problema cuando coinciden 
	// el vector Up con la dirección entre Eye y Target
	this.up = vec3.fromValues(x, y, z);
};

Camera.prototype.setTarget = function (x, y, z) {
	this.target = vec3.fromValues(x, y, z);
};

Camera.prototype.getViewMatrix = function () {
	var eye = this.getPosition();
	var lookat = mat4.create();
	mat4.lookAt(lookat, eye, this.target, this.up);
	return lookat;
};

Camera.prototype.getAlignedWithCamera = function (vector) {
	// alinea un vector según el Up de la camara
	var lookat = this.getViewMatrix();
	var aligned = vec3.create();
	vec3.transformMat4(aligned, vector, lookat);
	return aligned;
};

Camera.prototype.getProjectionMatrix = function () {
	console.error("Error: Abstract method not implemented");
};
