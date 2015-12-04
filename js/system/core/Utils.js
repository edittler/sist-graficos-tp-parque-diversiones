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


Utils.angleZ = function (vec, direccion) {
	var a = vec3.clone(direccion);
	var b = vec3.clone(vec);
	a = this.rotarAlPlanoXY(a);
	b = this.rotarAlPlanoXY(b);
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = this.angleBetweenVectors(a, b);
	//console.log("Angle Z: " + angle + " Z Direction: " + cross[2]);
	if (cross[2] < 0) {
		//angle *= -1;
	}
	return angle;
};

Utils.angleY = function (vec, direccion) {
	var a = direccion;
	var b = vec3.clone(vec);
	a[1] = 0;
	//console.log("X Direction: " + b[0] + " Y Direction: " + b[1] + " Z Direction: " + b[2]);
	b[1] = 0;
	/*
	if (vec3.length(b)) {
		return 0;
	}
	*/
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = this.angleBetweenVectors(a, b);
	console.log("Angle Y: " + angle + " Y Direction: " + cross[1]);
	/*
	if (cross[1] < 0) {
		angle *= -1;
	}
	*/
	return angle - Math.PI / 2;
	//return 0;
};

Utils.angleX = function (vec, direccion) {
	var a = vec3.clone(direccion);
	var b = vec3.clone(vec);
	a = this.rotarAlPlanoYZ(a);
	b = this.rotarAlPlanoYZ(b);
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = this.angleBetweenVectors(a, b);
	//console.log("Angle X: " + angle + " X Direction: " + cross[1]);
	if (cross[0] > 0) {
		angle *= -1;
	}
	return angle;
};

Utils.rotarAlPlanoXY = function (vec) {
	if (vec[2] === 0) {
		return vec;
	}
	var catAdy, c1, c2, c3, c4;
	if (vec[0] > vec[1]) {
		catAdy = vec[0];
		c1 = 0;
		c2 = 2;
		c3 = 8;
		c4 = 10;
	} else {
		catAdy = vec[1];
		c1 = 5;
		c2 = 6;
		c3 = 9;
		c4 = 10;
	}
	var dis = Math.sqrt(catAdy * catAdy + vec[2] * vec[2]);
	var mat = mat4.create();
	var cos = catAdy / dis;
	var sen = vec[2] / dis;
	mat[c1] = cos;
	mat[c2] = sen;
	mat[c3] = sen;
	mat[c4] = -cos;
	var vecRot = vec3.create();
	vec3.transformMat4(vecRot, vec, mat);
	return vecRot;
};

Utils.rotarAlPlanoYZ = function (vec) {
	if (vec[0] === 0) {
		return vec;
	}
	var catAdy, c1, c2, c3, c4;
	if (vec[1] > vec[2]) {
		catAdy = vec[1];
		c1 = 0;
		c2 = 1;
		c3 = 4;
		c4 = 5;
	} else {
		catAdy = vec[2];
		c1 = 0;
		c2 = 2;
		c3 = 8;
		c4 = 10;
	}
	var dis = Math.sqrt(catAdy * catAdy + vec[0] * vec[0]);
	var mat = mat4.create();
	var cos = catAdy / dis;
	var sen = vec[0] / dis;
	mat[c1] = cos;
	mat[c2] = sen;
	mat[c3] = -sen;
	mat[c4] = cos;
	var vecRot = vec3.create();
	vec3.transformMat4(vecRot, vec, mat);
	return vecRot;
};
