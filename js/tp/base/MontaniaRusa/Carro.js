/*
 * Carro de la Montania Rusa
 */
function Carro(path) {
	ComplexModel.call(this);

	this.curva = new CubicBSpline(path);

	var precision = 24;

	this.puntos = this.curva.getPoints(precision);
	this.derivadas = this.curva.getDerivativePoints(precision);
	this.recorrido = new Path(10);
	this.recorrido.addStretch(this.curva);
	this.kernel = this.recorrido.getKernelPoint();

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

	this.translateVector = null;
}

Carro.prototype = Object.create(ComplexModel.prototype);
Carro.prototype.constructor = Carro;

//@override
Carro.prototype.update = function (elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);

	// seteo como vector de traslacion al primer vector
	if(this.translateVector === null) {
		this.translateVector = this.getPosition();
	}

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

	// defino el vector up
	var up = vec3.fromValues(0, 0, 1);

	// nrm (normal) = tan x up (producto vectorial)
	var nrm = vec3.create();
	vec3.cross(nrm, tan, up);

	//bin (binormal) = tan x nrm (producto vectorial)
	var bin = vec3.create();
	vec3.cross(bin, tan, nrm);

	var currPointSpace = mat4.create();
	mat4.lookAt(currPointSpace, nrm, tan, bin);
	mat4.invert(currPointSpace, currPointSpace);

	// corrijo por el kernel para que vaya sobre las vias de la montania rusa
	// corrijo por la primer traslacion aplicada
	this.setPosition(point[0] - this.kernel[0] + this.translateVector[0],
					 point[1] - this.kernel[1] + this.translateVector[1],
					 point[2] - this.kernel[2] + this.translateVector[2]);
	this.applyTransformationMatrix(currPointSpace, false);

	this.rotateZ(Utils.angleZ(tan, this.direccion));
	this.rotateY(Utils.angleY(tan, this.direccion));
	//this.rotateY(Utils.angleX(tan, this.direccion) - Math.PI / 2);
};
