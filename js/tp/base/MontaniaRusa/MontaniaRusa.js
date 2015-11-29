/*
 * Montania Rusa
 */
function MontaniaRusa() {
	ComplexModel.call(this);

    var puntosControl = [
        [0,0,0], [100,0,200], [200,70,200], [300,0,200], 
        [40,0,0], [50,10,0], [60,20,0], [70,0,0], 
        [400,100,0], [200,20,0], [100,20,0], [50,20,0],
        [20,-10,0], [20,-20,0], [20,-50,0], [0,20,0],
        [0,20,0],[0,20,0],
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
