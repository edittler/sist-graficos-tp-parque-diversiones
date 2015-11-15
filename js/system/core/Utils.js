/**
 * Clase de utilidades con métodos estáticos
 */

function Utils() {}

// Métodos estáticos

Utils.isDefined = function (val) {
	return typeof val !== 'undefined' && val !== null;
};

Utils.randomBetween = function (a, b) {
	return a + Math.floor((Math.random() * b) + 1);
};

/**
 * Verifica si el valor es potencia de 2.
 *
 * @param {Number} value valor numero a verificar
 * @returns {bool} true si el número es potencia de 2
 */
Utils.isPowerOf2 = function (value) {
	return (value & (value - 1)) === 0;
};

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
