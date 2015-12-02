/**
 * Extensión del array nativo de JS
 */

Float32Array.prototype.max = function () {
	return Math.max.apply(null, this);
};

Float32Array.prototype.min = function () {
	return Math.min.apply(null, this);
};
