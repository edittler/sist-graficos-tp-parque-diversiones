/*
 * Curva lineal. Son todas lineas rectas entre los puntos de control
 */
function LinearCurve(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return (1 - u);
	};
	this.basis[1] = function (u) {
		return u;
	};

	BezierCurve.call(this, ctrlPoints, this.basis);
}

LinearCurve.prototype = Object.create(BezierCurve.prototype);

LinearCurve.prototype.constructor = LinearCurve;
