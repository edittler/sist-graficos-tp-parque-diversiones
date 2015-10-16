/*
 * Curva tipo Bezier
 */
function BezierCurve(ctrlPoints, basis) {
	Curve.call(this, ctrlPoints, this.basis);
	this.continuousPoints = []; // puntos para que los tramos queden continuos
}

BezierCurve.prototype = Object.create(Curve.prototype);

BezierCurve.prototype.constructor = BezierCurve;

BezierCurve.prototype.pointAt = function (u) {
	var basis = this.basis;
	var ctrlPoints = this.continuousPoints;

	if (ctrlPoints.length == 0) {
		ctrlPoints = this.ctrlPoints;
	}

	var stretch = Math.floor(u);
	var startPoint = stretch * (basis.length - 1);
	var deltaU = u - stretch;

	var point = [];

	for (var c = 0; c < 3; c++) {
		point[c] = 0;
		for (var p = 0; p < basis.length; p++) {
			point[c] += basis[p](deltaU) * ctrlPoints[startPoint + p][c];
		}
	}

	return point;
};

BezierCurve.prototype.setContinuousPoints = function (contPoints) {
	this.continuousPoints = contPoints;
};

BezierCurve.prototype.getPoints = function (definition) {
	var points = [];
	var deltaU = 1 / definition;

	for (var u = deltaU; u <= this.numbStretchs - deltaU; u += deltaU) {
		var point = this.pointAt(u);
		points = points.concat([point]);
	}

	points.unshift(this.ctrlPoints[0]);
	points.push(this.ctrlPoints[this.ctrlPoints.length - 1]);

	return points;
};
