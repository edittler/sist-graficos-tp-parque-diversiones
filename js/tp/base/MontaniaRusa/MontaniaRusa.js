/*
 * Montania Rusa
 */
function MontaniaRusa() {
	ComplexModel.call(this);

    var puntosControl = [
        [0,20,0], [0,20,0], [0,20,0], [0,60,10], 
        [0,60,10], [0,100,10], [0,100,20], [0,120,20], 
        [0,120,30], [200,300,70], [400,400,-10], [500,200,-10], 
        [500,100,10], [300,100,10], [400,100,10], [400,0,10],
        [400,0,0], [0,20,0], [0,20,0], [0,20,0]
    ];
    // var puntosControl = [
    //     [0,20,0], [0,20,0], [0,20,0], [0,100,10], 
    //     [0,200,20], [0,250,20], [0,270,20], [0,300,30], 
    //     [0,350,30], [10,400,0], [10,400,0], [10,400,0], 
    //     [30,400,30],[50,400,30],[50,400,30],[50,400,30],
    //     [70,350,30],[80,300,40],[100,300,50],[100,250,60],
    //     [50,100,20],[0,20,0], [0,20,0], [0,20,0],
    // ];

    // var puntosControl = [
    //     [10,20,0], [10,20,0], [10,20,0], [10,100,10], 
    //     [10,200,20], [10,250,20], [10,270,20], [10,300,30], 
    //     [10,350,30], [20,400,0], [20,400,0], [20,400,0], 
    //     [40,400,30],[60,400,30],[60,400,30],[60,400,30],
    //     [80,350,30],[90,300,40],[110,300,50],[110,250,60],
    //     [60,100,20],[10,20,0], [10,20,0], [10,20,0],
    // ];

	this.vias = new Vias(puntosControl);

	var axis = new Axis();
	axis.scale(30);

	this.addChild(this.vias);
	this.addChild(axis);
}

MontaniaRusa.prototype = Object.create(ComplexModel.prototype);
MontaniaRusa.prototype.constructor = MontaniaRusa;
