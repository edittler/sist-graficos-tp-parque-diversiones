/*
 *   Curva de BSpline cuadrática
 */
function QuadraticBSpline(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return 0.5 * (1 - u) * (1 - u);
	};
	this.basis[1] = function (u) {
		return 0.5 + u * (1 - u);
	};
	this.basis[2] = function (u) {
		return 0.5 * u * u;
	};

	BSplineCurve.call(this, ctrlPoints, this.basis);
}

QuadraticBSpline.prototype = Object.create(BSplineCurve.prototype);
QuadraticBSpline.prototype.constructor = QuadraticBSpline;
