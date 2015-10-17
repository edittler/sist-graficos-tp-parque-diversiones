/*
 * Camara para enfocar la escena en perspectiva
 */
function PerspectiveCamera(w, h) {
	Camera.call(this);

	this.pMatrix = mat4.create();

	// matriz de perspectiva por default
	this.setPerspective(30, w / h, 0.1, 1600.0);
}

PerspectiveCamera.prototype = Object.create(Camera.prototype);

PerspectiveCamera.prototype.constructor = PerspectiveCamera;

PerspectiveCamera.prototype.setPerspective = function (fov, aspect, near, far) {
	// Preparamos una matriz de perspectiva
	mat4.identity(this.pMatrix);
	mat4.perspective(this.pMatrix, fov, aspect, near, far);
};

// @override
PerspectiveCamera.prototype.getProjectionMatrix = function () {
	return this.pMatrix;
};
