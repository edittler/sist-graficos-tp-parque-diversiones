function CamaraOrbital(width, height, eye, target, up) {
	this.camara = new PerspectiveCamera(width, height);
	this.camara.setUp(up[0], up[1], up[2]);
	this.camara.setPosition(eye[0], eye[1], eye[2]);
	this.camara.setTarget(target[0], target[1], target[2]);

	this.factorRotacion = 5;
	this.factorZoom = 1.2;
}

CamaraOrbital.prototype.signo = function (n) {
	var res = 0;

	if (n > 0) {
		res = 1;
	} else if (n < 0) {
		res = -1;
	}

	return res;
};

CamaraOrbital.prototype.zoomIn = function () {
	this.camara.scale(this.factorZoom);
};

CamaraOrbital.prototype.zoomOut = function () {
	this.camara.scale(1 / this.factorZoom);
};

CamaraOrbital.prototype.rotate = function (rotateY, rotateZ) {
	this.camara.rotateZ(Utils.degToRad(rotateY / this.factorRotacion));
	this.camara.rotateY(Utils.degToRad(rotateZ / this.factorRotacion));
};

CamaraOrbital.prototype.getPerspectiveCamera = function () {
	return this.camara;
};
