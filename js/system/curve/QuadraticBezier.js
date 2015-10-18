/*
 * Curva de Bezier cuadrática. Se obtienen puntos de control calculados 
 * para que curvas con más de 1 tramo (grado+1 < cant. puntos) se 
 * dibujen en forma continua.
 */
function QuadraticBezier(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return (1 - u) * (1 - u);
	};
	this.basis[1] = function (u) {
		return 2 * u * (1 - u);
	};
	this.basis[2] = function (u) {
		return u * u;
	};

	BezierCurve.call(this, ctrlPoints, this.basis);

	this.setControlPoints(ctrlPoints);
}

QuadraticBezier.prototype = Object.create(BezierCurve.prototype);
QuadraticBezier.prototype.constructor = QuadraticBezier;

QuadraticBezier.prototype.calculateContinuousPoints = function () {
	var numbPoints = this.ctrlPoints.length;
	var continuous = [];

	continuous.push(this.ctrlPoints[0]);

	for (var p = 1; p < numbPoints - 2; p++) {
		var p1 = vec3.create();
		var p2 = vec3.create();
		var middle = vec3.create();

		vec3.copy(p1, this.ctrlPoints[p]);
		vec3.copy(p2, this.ctrlPoints[p + 1]);

		vec3.subtract(middle, p2, p1);
		vec3.scale(middle, middle, 0.5);
		vec3.add(middle, middle, p1);

		continuous.push(p1);
		continuous.push(middle);
	}

	continuous.push(this.ctrlPoints[numbPoints - 2]);
	continuous.push(this.ctrlPoints[numbPoints - 1]);

	this.setContinuousPoints(continuous);
};

// @Override
QuadraticBezier.prototype.setControlPoints = function (newCtrlPoints) {
	BezierCurve.prototype.setControlPoints.call(this, newCtrlPoints);

	if (this.numbStretchs > 1) {
		this.calculateContinuousPoints();
	}
};
