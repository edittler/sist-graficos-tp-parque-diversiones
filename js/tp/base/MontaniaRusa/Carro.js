/*
 * Carro de la Montania Rusa
 */
function Carro(path) {
	ComplexModel.call(this);

	this.curva = new CubicBSpline(path);

	var precision = 22;

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
	console.log("X: " + tan[0] + " Y: " + tan[1] + " Z: " + tan[2]);


	// defino el vector UP
	var UP = vec3.fromValues(0, 1, 0);

	//bin = UP x tan (producto vectorial)
	var bin = vec3.create();
	vec3.cross(bin, UP, tan);

	//nrm = tan x bin
	var nrm = vec3.create();
	vec3.cross(nrm, tan, bin);

	// m1 = traslación a POS
	//var m1 = mat4.create();
	//mat4.translate(m1, m1, pos);
	//mat4.scale(m1, m1, vec3.fromValues(2, 2, 2));

	// Realizo cambio de base
	//this.updateMatrix(m1, tan, nrm, bin);

	// m2 = rotacion segun ejes tan,nrm,bin   (defino un cambio de base)
	//var m2 = mat4.create();
	//this.updateMatrix(m2, tan, nrm, bin);
	//m2.makeBasis(tan, nrm, bin);
	//var tan4 = vec4.fromValues(tan[0], tan[1], tan[2], 0.0);
	//var nrm4 = vec4.fromValues(nrm[0], nrm[1], nrm[2], 0.0);
	//var bin4 = vec4.fromValues(bin[0], bin[1], bin[2], 0.0);
	// TODO: Armar la matriz de cambio de base.
	//mat4.multiply(m1, m1, m2); // m1 = m1 * m2

	//this.caja.applyTransformationMatrix(m1);
	//this.axis.applyTransformationMatrix(m1);

	//this.resetTransformations();
	this.setPosition(point[0], point[1], point[2]);
	this.rotateZ(this.angleZ(tan));
	this.rotateY(this.angleY(tan));
	//this.rotateX(this.angleX(tan));
	//this.direccion = tan;
};

Carro.prototype.updateMatrix = function (mat4, tan, nrm, bin) {
	// primera columna, agrego tangente
	mat4[0] = tan[0];
	mat4[1] = tan[1];
	mat4[2] = tan[2];

	// segunda columna, agrego normal
	mat4[4] = nrm[0];
	mat4[5] = nrm[1];
	mat4[6] = nrm[2];

	// tercera columna, agrego bin
	mat4[8] = bin[0];
	mat4[9] = bin[1];
	mat4[10] = bin[2];
};

Carro.prototype.angleZ = function (vec) {
	var a = this.direccion;
	var b = vec3.clone(vec);
	a[2] = 0;
	b[2] = 0;
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = Utils.angleBetweenVectors(a, b);
	//console.log("Angle Z: " + angle + " Z Direction: " + cross[2]);
	if (cross[2] < 0) {
		angle *= -1;
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
	var a = this.direccion;
	var b = vec3.clone(vec);
	a[0] = 0;
	//console.log("X Direction: " + b[0] + " Y Direction: " + b[1] + " Z Direction: " + b[2]);
	b[0] = 0;
	/*
	if (vec3.length(vec)) {
		return 0;
	}
	*/
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = Utils.angleBetweenVectors(a, b);
	console.log("Angle X: " + angle + " X Direction: " + cross[1]);
	/*
	if (cross[1] < 0) {
		angle *= -1;
	}
	*/
	return angle;
	//return 0;
};
