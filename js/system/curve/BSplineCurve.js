/*
 * Curva tipo BSpline
 */
function BSplineCurve(ctrlPoints, basis) {
	Curve.call(this, ctrlPoints, basis);
}

BSplineCurve.prototype = Object.create(Curve.prototype);
BSplineCurve.prototype.constructor = BSplineCurve;

BSplineCurve.prototype.pointAt = function (u, stretch) {
	var basis = this.basis;
	var ctrlPoints = this.ctrlPoints;

	var startPoint = stretch + basis.length > ctrlPoints.length ? stretch - 1 : stretch;
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

BSplineCurve.prototype.getPoints = function (definition) {
	var points = [];
	var deltaU = 1 / definition;
	var stretch = 0;

	for (var u = 0; u <= this.numbStretchs + deltaU; u += deltaU) {
		var point = this.pointAt(u, stretch);
		points = points.concat([point]);

		if (Math.floor(u) > stretch) {
			stretch++;
		}
	}

	return points;
};
