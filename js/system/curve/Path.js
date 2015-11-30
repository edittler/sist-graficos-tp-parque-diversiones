/*
 * Conjunto de tramos definidos por puntos de varias curvas.
 * Se le pueden aplicar transformaciones a todos los puntos.
 */
function Path(definition) {
	Transformable.call(this);
	this.curves = []; // curvas que forman el camino
	this.definition = definition; // medida de puntos intermedios generados

	if (!Utils.isDefined(definition)) {
		this.definition = 1;
	}
}

Path.prototype = Object.create(Transformable.prototype);

Path.prototype.constructor = Path;

Path.prototype.transform = function (point) {
	var vec = vec3.fromValues(point[0], point[1],
		Utils.isDefined(point[2]) && !isNaN(point[2]) ? point[2] : 0);
	vec3.transformMat4(vec, vec, this.objectMatrix);
	return vec;
};

Path.prototype.addStretch = function (curve) {
	// agrega un nuevo tramo al camino
	this.curves.push(curve);
};

Path.prototype.getControlPoints = function () {
	var points = [];

	for (var c = 0; c < this.curves.length; c++) {
		var curvePoints = this.curves[c].getControlPoints();
		for (var p = 0; p < curvePoints.length; p++) {
			points = points.concat(this.transform(curvePoints[p]));
		}
	}

	return points;
};

Path.prototype.getPoints = function () {
	var points = [];

	for (var c = 0; c < this.curves.length; c++) {
		var curvePoints = this.curves[c].getPoints(this.definition);
		for (var p = 0; p < curvePoints.length; p++) {
			points = points.concat(this.transform(curvePoints[p]));
		}
	}
	return points;
};

Path.prototype.getKernelPoint = function (pts) {
	var points = pts;

	if (!Utils.isDefined(points)) {
		points = this.getControlPoints();
	}

	var xKernel = 0;
	var yKernel = 0;
	var zKernel = 0;

	for (var p = 0; p < points.length; p++) {
		xKernel += points[p][0];
		yKernel += points[p][1];
		zKernel += points[p][2];
	}

	xKernel /= points.length;
	yKernel /= points.length;
	zKernel /= points.length;

	return [xKernel, yKernel, zKernel];
};
