/*
 * Carro de la Montania Rusa
 */
function Carro() {
	ComplexModel.call(this);

	var material = new ColoredMaterial(Color.RED);
	var ancho = 5;
	var largo = 10
	var alto = 5;
	this.caja = new Box(ancho, alto, largo, material);
	this.caja.translateY(-alto/2);

	var axis = new Axis();
	axis.scale(20);

	this.addChild(this.caja);
	this.addChild(axis);
}

Carro.prototype = Object.create(ComplexModel.prototype);
Carro.prototype.constructor = Carro;
