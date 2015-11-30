/*
 * Carro de la Montania Rusa
 */
function Carro(path) {
	ComplexModel.call(this);

	this.curva = new CubicBSpline(path);

	var precision = 24;

	this.puntos = this.curva.getPoints(precision);
	this.derivadas = this.curva.getDerivativePoints(precision);
	this.recorrido = new Path(8);
	this.recorrido.addStretch(this.curva);

	var material = new ColoredMaterial(Color.RED);
	var ancho = 10;
	var largo = 20;
	var alto = 5;
	this.caja = new Box(ancho, alto, largo, material);

	this.axis = new Axis();
	this.axis.scale(20);

	this.addChild(this.caja);
	this.addChild(this.axis);

	this.velocidad = 0.01;
	this.direccion = vec3.fromValues(1.000001, 0.000001, 0.000001);
	vec3.normalize(this.direccion, this.direccion);
	this.distanciaRecorrida = 0;
}

Carro.prototype = Object.create(ComplexModel.prototype);
Carro.prototype.constructor = Carro;

//@override
Carro.prototype.update = function (elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);

	//posVec,tanVec,nrmVec,binVec

	// calculo posicion sobre la curva
	this.distanciaRecorrida += (elapsedTime) * this.velocidad;
	var modDistancia = Math.floor(this.distanciaRecorrida) % this.puntos.length;
	var point = this.puntos[modDistancia];
	//var pos = vec3.fromValues(point[0], point[1], point[2]);

	// calculo tangente de la curva
	var derivada = this.derivadas[modDistancia];
	var tan = vec3.fromValues(derivada[0], derivada[1], derivada[2]);
	vec3.normalize(tan, tan);
	//console.log("X: " + tan[0] + " Y: " + tan[1] + " Z: " + tan[2]);

	/*
	// defino el vector UP
	var UP = vec3.fromValues(0, 1, 0);

	//bin = UP x tan (producto vectorial)
	var bin = vec3.create();
	vec3.cross(bin, UP, tan);

	//nrm = tan x bin
	var nrm = vec3.create();
	vec3.cross(nrm, tan, bin);
	*/

	this.setPosition(point[0], point[1], point[2]);
	this.rotateZ(this.angleZ(tan));
	//this.rotateY(this.angleY(tan));
	this.rotateY(this.angleX(tan) - Math.PI / 2);
};

Carro.prototype.angleZ = function (vec) {
	var a = vec3.clone(this.direccion);
	var b = vec3.clone(vec);
	a = this.rotarAlPlanoXY(a);
	b = this.rotarAlPlanoXY(b);
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = Utils.angleBetweenVectors(a, b);
	//console.log("Angle Z: " + angle + " Z Direction: " + cross[2]);
	if (cross[2] < 0) {
		//angle *= -1;
	}
	return angle;
};

Carro.prototype.angleY = function (vec) {
	var a = this.direccion;
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
	var angle = Utils.angleBetweenVectors(a, b);
	console.log("Angle Y: " + angle + " Y Direction: " + cross[1]);
	/*
	if (cross[1] < 0) {
		angle *= -1;
	}
	*/
	return angle - Math.PI / 2;
	//return 0;
};

Carro.prototype.angleX = function (vec) {
	var a = vec3.clone(this.direccion);
	var b = vec3.clone(vec);
	a = this.rotarAlPlanoYZ(a);
	b = this.rotarAlPlanoYZ(b);
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = Utils.angleBetweenVectors(a, b);
	//console.log("Angle X: " + angle + " X Direction: " + cross[1]);
	if (cross[0] > 0) {
		angle *= -1;
	}
	return angle;
};

Carro.prototype.rotarAlPlanoXY = function (vec) {
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

Carro.prototype.rotarAlPlanoYZ = function (vec) {
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
