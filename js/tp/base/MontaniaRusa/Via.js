/*
    Via
*/
function Via( path , ratio, number, color) {
    this.constructor(path,ratio,number,color);
}

// Métodos
Via.prototype = (function() {
    var pr = {}; // jshint ignore:line
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( path , ratio, number, color) {
        PrimitiveModel.prototype.constructor.call(this);

        // var tricirculo = new TriCircle(ratio);
        var circle = new Circle(ratio);
        if( number == 1) {
            circle.translateY(10);
        } else if(number == 2) {
            circle.translateX(-5);
        } else if (number == 3) {
            circle.translateY(-10);
        }

        var recorrido = new Path(10);
        // recorrido.addStretch(new CubicBSpline(path));

		/*
        var path1 = [[0,100,0], [50,100,0], [100,50,0], [100,0,0],
        [100,0,0], [100,-50,0], [50,0,-5], [10,0,-5]];
		*/
        // var path2 = [[300,200,200], [400,200,400], [450,-100,0], [70,0,0]];
            // [400,100,0], [200,20,0], [100,20,0], [50,20,0],
            // [20,-10,0], [20,-20,0], [20,-50,0], [0,20,0],
            // [0,20,0],[0,20,0],
        // ];
        recorrido.addStretch(new CubicBSpline(path));
        
        // var geometry = new SweptSurface(recorrido, tricirculo);
        var geometry = new SweptSurface(recorrido, circle);
        geometry.setClosedShapes(false);
        geometry.setClosedEndings(false);
        geometry.setCenteredInKernel(false);

        pu.init.call(this, geometry, new ColoredMaterial(color));
    };

    // Métodos privados

    // Métodos públicos

    return pu;
})();
