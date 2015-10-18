/*
 * Curva de BSpline cúbica
 */
function CubicBSpline(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return (1 - u) * (1 - u) * (1 - u) * 1 / 6;
	};
	this.basis[1] = function (u) {
		return (4 - 6 * u * u + 3 * u * u * u) * 1 / 6;
	};
	this.basis[2] = function (u) {
		return (1 + 3 * u + 3 * u * u - 3 * u * u * u) * 1 / 6;
	};
	this.basis[3] = function (u) {
		return u * u * u * 1 / 6;
	};

	BSplineCurve.call(this, ctrlPoints, this.basis);
}

CubicBSpline.prototype = Object.create(BSplineCurve.prototype);
CubicBSpline.prototype.constructor = CubicBSpline;
