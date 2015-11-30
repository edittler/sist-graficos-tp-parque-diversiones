/*
 * Montania Rusa
 */
function MontaniaRusa() {
	ComplexModel.call(this);

	var primero = [200, 150, 40],
		segundo = [100, 50, 40],
		tercero = [50, 350, 40];
	var puntosControl = [
		primero,
		segundo,
		tercero,
		[200, 250, 40],
		[250, 300, 40],
		[350, 400, 40],
		[400, 300, 40],
		[350, 250, 40],
		[350, 150, 40],
		[400, 100, 40],
		[350, 50, 40],
		[250, 150, 40],
		primero,
		segundo,
		tercero,
	];

	this.vias = new Vias(puntosControl);
	this.carro = new Carro(puntosControl);
	this.lago = new LagoArtificial();

	var axis = new Axis();
	axis.scale(30);

	this.addChild(this.vias);
	this.addChild(this.carro);
	this.addChild(this.lago);
	this.addChild(axis);
}

MontaniaRusa.prototype = Object.create(ComplexModel.prototype);
MontaniaRusa.prototype.constructor = MontaniaRusa;

MontaniaRusa.prototype.getCarro = function () {
	return this.carro;
};
