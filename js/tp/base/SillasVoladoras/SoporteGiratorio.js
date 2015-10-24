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
        for(var i=0; i<8; i++) {
            silla = new Silla(8);
            silla.rotateY(Utils.degToRad(rotation));
            silla.translateZ(50);
            rotation = rotation + 45;
            pu.addChild.call(this, silla);            
        }
    }

    return pu;
})();

//@override
SoporteGiratorio.prototype.update = function(elapsedTime) {
    ComplexModel.prototype.update.call(this, elapsedTime);
    this.rotateX(Utils.degToRad(elapsedTime/200));
    this.rotateY(Utils.degToRad(elapsedTime/80));
};