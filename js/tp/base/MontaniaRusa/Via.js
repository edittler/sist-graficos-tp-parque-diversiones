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

        var recorrido = new Path(8);
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
