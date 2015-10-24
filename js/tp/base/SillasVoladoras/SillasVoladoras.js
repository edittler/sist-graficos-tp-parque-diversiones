/*
 * Sillas voladoras
 */

function SillasVoladoras() {
    this._soporteGiratorio;
    this._base;

    this.constructor();
}

//Metodos
SillasVoladoras.prototype = (function () {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);  // extiende ComplexModel

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._base = new Base();
        
        this._soporteGiratorio = new SoporteGiratorio();
        this._soporteGiratorio.translateY(80);

        pu.addChild.call(this, this._base);
        pu.addChild.call(this,  this._soporteGiratorio);
    }

    return pu;
})();