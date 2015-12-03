/*
    Via
*/
function Via( path , ratio, number, material) {
    this.constructor(path,ratio,number,material);
}

// Métodos
Via.prototype = (function() {
    var pr = {}; // jshint ignore:line
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( path , ratio, number, material) {
        PrimitiveModel.prototype.constructor.call(this);

        // var tricirculo = new TriCircle(ratio);
        var circle = new Circle(ratio);
        if( number == 1) {
            circle.translateX(10);
        } else if(number == 2) {
            circle.translateY(-5);
        } else if (number == 3) {
            circle.translateX(-10);
        }

        var recorrido = new Path(10);

        recorrido.addStretch(new CubicBSpline(path));

        var geometry = new SweptSurface(recorrido, circle);
        geometry.setUpVector([0,0,1]);
        geometry.setClosedShapes(false);
        geometry.setClosedEndings(false);
        geometry.setCenteredInKernel(false);

        pu.init.call(this, geometry, material);
    };

    // Métodos privados

    // Métodos públicos

    return pu;
})();
