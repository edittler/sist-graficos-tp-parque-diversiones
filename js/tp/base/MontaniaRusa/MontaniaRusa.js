/*
 * Montania Rusa
 */
function MontaniaRusa() {
	ComplexModel.call(this);

	// var puntosControl = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [10, 0, 50],
	// 					 [-30, 0, 70], [0, 0, 120], [0, 0, 120], [0, 0, 120]];
    var puntosControl = [
        [0,20,0], [0,20,0], [0,20,0], [0,60,10], 
        [0,60,10], [0,100,10], [0,100,20], [0,120,20], 
        [0,120,30], [200,300,70], [400,400,-10], [500,200,-10], 
        [500,100,10], [300,100,10], [400,100,10], [400,0,10],
        [400,0,0], [0,20,0], [0,20,0], [0,20,0]
    ];

	this.vias = new Vias(puntosControl);

	var axis = new Axis();
	axis.scale(30);

	this.addChild(this.vias);
	this.addChild(axis);
}

MontaniaRusa.prototype = Object.create(ComplexModel.prototype);
MontaniaRusa.prototype.constructor = MontaniaRusa;
