/*
 * Clase de utilidades con métodos estáticos
 */

function Utils() {}

// Métodos estáticos
Utils.degToRad = function (rad) {
	return rad * (Math.PI / 180);
};

Utils.randomBetween = function (a, b) {
	return a + Math.floor((Math.random() * b) + 1);
};

Utils.isDefined = function (val) {
	return typeof val != 'undefined' && val != null;
};
