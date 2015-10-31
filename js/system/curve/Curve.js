/*
 * Clase base para las curvas. Se definen a partir de los
 * puntos de control y las bases.
 */

function Curve(ctrlPoints, basis) {
	this.ctrlPoints = ctrlPoints; // puntos de control originales

	this.basis = basis; // bases que definen los pesos de los puntos

	// cantidad de tramos
	this.numbStretchs = ctrlPoints.length - this.basis.length + 1;
}

Curve.prototype.setControlPoints = function (newCtrlPoints) {
	this.ctrlPoints = newCtrlPoints;
};

Curve.prototype.getControlPoints = function () {
	return this.ctrlPoints;
};

Curve.prototype.getPoints = function (definition) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
	return;
};
