function CamaraSeguimiento(objetoASeguir, width, height, eye, target, up) {
	this.objetoASeguir = objetoASeguir;
	this.targetInicial = target;
	this.eyeInicial = eye;
	this.rotateY = 0;
	this.rotateZ = 0;
	this.camara = new PerspectiveCamera(width, height);
	this.camara.setUp(up[0], up[1], up[2]);
	this.camara.setPosition(eye[0], eye[1], eye[2]);
	this.camara.setTarget(target[0], target[1], target[2]);
}

// Metodos privados

CamaraSeguimiento.prototype.transformarEye = function (matriz) {
	var newEye = vec3.create();
	vec3.transformMat4(newEye, this.eyeInicial, matriz);
	return newEye;
};

CamaraSeguimiento.prototype.transformarTarget = function (matriz) {
	var newTarget = vec3.create();
	vec3.transformMat4(newTarget, this.targetInicial, matriz);
	return newTarget;
};

CamaraSeguimiento.prototype.doRotate = function () {
	this.camara.rotateZ(Utils.degToRad(this.rotateY / this.factorRotacion));
	this.camara.rotateY(Utils.degToRad(this.rotateZ / this.factorRotacion));
};

// Métodos públicos

CamaraSeguimiento.prototype.rotate = function (rotateY, rotateZ) {
	this.rotateY = rotateY;
	this.rotateZ = rotateZ;
};

CamaraSeguimiento.prototype.update = function () {
	var matrizTransformacion = this.objetoASeguir.objectMatrix;
	var newEye = this.transformarEye(matrizTransformacion);
	var newTarget = this.transformarTarget(matrizTransformacion);
	this.camara.setPosition(newEye[0], newEye[1], newEye[2]);
	this.camara.setTarget(newTarget[0], newTarget[1], newTarget[2]);
	//	 this.doRotate();  TODO que permita rotar
	this.rotateY = 0;
	this.rotateZ = 0;
};

CamaraSeguimiento.prototype.getPerspectiveCamera = function () {
	return this.camara;
};
