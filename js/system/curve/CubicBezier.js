/*
 * Curva de Bezier cúbica
 */
function CubicBezier(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return (1 - u) * (1 - u) * (1 - u);
	};
	this.basis[1] = function (u) {
		return 3 * (1 - u) * (1 - u) * u;
	};
	this.basis[2] = function (u) {
		return 3 * (1 - u) * u * u;
	};
	this.basis[3] = function (u) {
		return u * u * u;
	};

	BezierCurve.call(this, ctrlPoints, this.basis);

	this.setControlPoints(ctrlPoints);
}

CubicBezier.prototype = Object.create(BezierCurve.prototype);
CubicBezier.prototype.constructor = CubicBezier;

CubicBezier.prototype.calculateContinuousPoints = function () {
	// TODO: averiguar como encontrar el punto de union
	// de los tramos de manera que queden C2 continuo
	console.error("CubicBezier: bezier cúbica no soporta más de 4 puntos de control");
};

// @Override
CubicBezier.prototype.setControlPoints = function (newCtrlPoints) {
	BezierCurve.prototype.setControlPoints.call(this, newCtrlPoints);

	this.numbStretchs = this.ctrlPoints.length/this.basis.length;

	if (this.numbStretchs > 1) {
		this.calculateContinuousPoints();
	}
};
