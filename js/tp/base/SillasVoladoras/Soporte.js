/*
    Soporte
*/
function Soporte() {
    this.constructor();
}

// Métodos
Soporte.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function() {
        PrimitiveModel.prototype.constructor.call(this);

        var side = new Path(10);
        side.addStretch(new LinearCurve([
            [1,0], [6,1], [6,2], 
        ]));

        var geometry = new RevolutionSurface(side, 30);
        geometry.setClosedEndings(false);
        geometry.setCenteredInKernel(false);

        var material = new ColoredMaterial(Color.RED);

        pu.init.call(this, geometry, material);
        
    }
    
    return pu;
})();
