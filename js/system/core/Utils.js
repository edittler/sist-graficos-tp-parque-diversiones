/**
 * Clase de utilidades con métodos estáticos
 */

function Utils() {}

// Métodos estáticos

Utils.degToRad = function (rad) {
	return rad * (Math.PI / 180);
};

/**
 * Calcula el ángulo entre 2 vectores de 3 dimensiones
 *
 * @param {vec3} a vector de 3 dimensiones
 * @param {vec3} b vector de 3 dimensiones
 * @returns {Number} angulo entre los 2 vectores
 */
Utils.angleBetweenVectors = function (a, b) {
	var normalizedA = vec3.create();
	vec3.normalize(normalizedA, a);

	var normalizedB = vec3.create();
	vec3.normalize(normalizedB, b);

	var dotProduct = vec3.dot(normalizedA, normalizedB);
	var angle = Math.acos(dotProduct);
	return angle;
};

Utils.randomBetween = function (a, b) {
	return a + Math.floor((Math.random() * b) + 1);
};

Utils.isDefined = function (val) {
	return typeof val != 'undefined' && val !== null;
};
