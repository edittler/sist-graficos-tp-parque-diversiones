/*
    Via
*/
function Via( path , ratio, color) {
    this.constructor(path,ratio,color);
}

// Métodos
Via.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( path , ratio, color) {
        PrimitiveModel.prototype.constructor.call(this);

        var circulo = new Circle(ratio);

        var recorrido = new Path(8);
        recorrido.addStretch(new CubicBSpline(path));
        
        var geometry = new SweptSurface(recorrido, circulo);
        geometry.setClosedShapes(false);
        geometry.setClosedEndings(false);

        pu.init.call(this, geometry, new ColoredMaterial(color));
    }

    // Métodos privados

    // Métodos públicos

    return pu;
})();