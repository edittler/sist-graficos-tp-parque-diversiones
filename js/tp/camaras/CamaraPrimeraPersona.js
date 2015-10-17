function CamaraPrimeraPersona(width, height, eye, target, up) {
	this.targetInicial = target;
	this.eyeInicial = eye;
	this.camara = new PerspectiveCamera(width, height);
	this.camara.setUp(up[0], up[1], up[2]);
	this.camara.setPosition(eye[0], eye[1], eye[2]);
	this.camara.setTarget(target[0], target[1], target[2]);

	this.objetoFicticio = new Transformable();
	this.objetoFicticio.setPosition(eye[0], eye[1], eye[2]);
}

CamaraPrimeraPersona.prototype.transformarEye = function (matriz) {
	var newEye = vec3.create();
	vec3.transformMat4(newEye, this.eyeInicial, matriz);
	return newEye;
};

CamaraPrimeraPersona.prototype.transformarTarget = function (matriz) {
	var newTarget = vec3.create();
	vec3.transformMat4(newTarget, this.targetInicial, matriz);
	return newTarget;
};

CamaraPrimeraPersona.prototype.update = function () {
	var matrizTransformacion = this.objetoFicticio.objectMatrix;
	var newEye = this.transformarEye(matrizTransformacion);
	var newTarget = this.transformarTarget(matrizTransformacion);
	this.camara.setPosition(newEye[0], newEye[1], newEye[2]);
	this.camara.setTarget(newTarget[0], newTarget[1], newTarget[2]);
};

CamaraPrimeraPersona.prototype.rotate = function (rotateY, rotateZ) {
	this.objetoFicticio.rotateZ(-Utils.degToRad(rotateY / 5));
	this.objetoFicticio.rotateY(Utils.degToRad(rotateZ / 5));
	this.update(this);
};

CamaraPrimeraPersona.prototype.trasladarDerecha = function (n) {
	this.objetoFicticio.translate(0, -n, 0);
	this.update();
};

CamaraPrimeraPersona.prototype.trasladarIzquierda = function (n) {
	this.objetoFicticio.translate(0, n, 0);
	this.update();
};

CamaraPrimeraPersona.prototype.trasladarAdelante = function (n) {
	this.objetoFicticio.translate(n, 0, 0);
	this.update();
};

CamaraPrimeraPersona.prototype.trasladarAtras = function (n) {
	this.objetoFicticio.translate(-n, 0, 0);
	this.update();
};

CamaraPrimeraPersona.prototype.getPerspectiveCamera = function () {
	return this.camara;
};
