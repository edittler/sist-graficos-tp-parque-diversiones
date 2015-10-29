/*
 * Montania Rusa
 */
function MontaniaRusa() {
	ComplexModel.call(this);

	// var puntosControl = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [10, 0, 50],
	// 					 [-30, 0, 70], [0, 0, 120], [0, 0, 120], [0, 0, 120]];
    var puntosControl = [[0,0,0], [0,0,0], [0,0,0], [10,0,50], [-30,0,70], 
        [0,0,120], [0,0,120], [0,0,120] , [10,50,0]
    ];

	this.vias = new Vias(puntosControl);

	var axis = new Axis();
	axis.scale(30);

	this.addChild(this.vias);
	this.addChild(axis);
}

MontaniaRusa.prototype = Object.create(ComplexModel.prototype);
MontaniaRusa.prototype.constructor = MontaniaRusa;
