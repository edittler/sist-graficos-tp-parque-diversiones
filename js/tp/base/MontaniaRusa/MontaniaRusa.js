/*
 * Montania Rusa
 */
function MontaniaRusa() {
	ComplexModel.call(this);

	var primero = [200, 150, 110],
		segundo = [100, 50, 110],
		tercero = [50, 350, 110];
	var puntosControl = [
		primero,
		segundo,
		tercero,
		[200, 250, 110],
		[250, 300, 110],
		[350, 400, 110],
		[400, 300, 110],
		[350, 250, 110],
		[350, 150, 110],
		[400, 100, 150],
		[350, 50, 150],
		[250, 150, 150],
		primero,
		segundo,
		tercero,
	];

	this.vias = new Vias(puntosControl);
	this.carro = new Carro(puntosControl);
	this.lago = new LagoArtificial();

	this.vias.translateZ(100);
	this.carro.translateZ(100);

	var axis = new Axis();
	axis.scale(30);

	this.addChild(this.vias);
	this.addColumnas(puntosControl);
	this.addChild(this.carro);
	this.addChild(this.lago);
	this.addChild(axis);
}

MontaniaRusa.prototype = Object.create(ComplexModel.prototype);
MontaniaRusa.prototype.constructor = MontaniaRusa;

MontaniaRusa.prototype.getCarro = function () {
	return this.carro;
};

MontaniaRusa.prototype.addColumnas = function(puntosDeControl) {
	var precision = 2;
	var curva = new CubicBSpline(puntosDeControl);
	var puntos = curva.getPoints(precision);
	var recorrido = new Path(10);
	recorrido.addStretch(curva);
	var kernel = recorrido.getKernelPoint();
	var translateVector = this.getPosition();

	for (var i = 0; i < puntos.length; i++) {
		var point = puntos[i];
		var columna = new Columna(kernel[2] + 30);
		columna.setPosition(point[0] - kernel[0] + translateVector[0], point[1] - kernel[1] + translateVector[1], 21 + point[2] - kernel[2] + translateVector[2]);
		this.addChild(columna);
	}
};
