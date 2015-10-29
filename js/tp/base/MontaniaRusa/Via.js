/*
    Via
*/
function Via( path ) {
    this.constructor(path);
}

// Métodos
Via.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( path ) {
        PrimitiveModel.prototype.constructor.call(this);

        var circulo = new Circle(1);

        var recorrido = new Path(8);
        recorrido.addStretch(new CubicBSpline(path));
        
        var geometry = new SweptSurface(recorrido, circulo);
        geometry.setClosedShapes(false);
        geometry.setClosedEndings(false);

        pu.init.call(this, geometry, new ColoredMaterial(Color.GREY));
    }

    // Métodos privados

    // Métodos públicos

    return pu;
})();