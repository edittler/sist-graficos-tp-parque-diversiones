/*
 * Soporte Giratorio
 */
function SoporteGiratorio() {
    this._soporte;

    this.constructor();
}

//Metodos
SoporteGiratorio.prototype = (function () {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);  // extiende ComplexModel

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._soporte = new Soporte();

        pu.addChild.call(this, this._soporte);

        rotation = 90;
        for(var i=0; i<6; i++) {
            silla = new Silla();
            silla.rotateY(Utils.degToRad(rotation));
            silla.translateZ(5);
            rotation = rotation + 45;
            pu.addChild.call(this, silla);            
        }
    }

    return pu;
})();