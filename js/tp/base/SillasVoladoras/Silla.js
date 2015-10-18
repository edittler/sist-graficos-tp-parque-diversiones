/*
    Silla
*/
function Silla() {
	this._base;
	this._respaldo;
    this.constructor();
}

// Métodos
Silla.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._base = new Box(1,1,0.5, new ColoredMaterial(Color.GREY));
        this._base.rotateZ(Utils.degToRad(-90));
        this._base.translateZ(1);

        this._respaldo = new Box(1,1,0.5, new ColoredMaterial(Color.GREY));

        pu.addChild.call(this, this._base);
        pu.addChild.call(this, this._respaldo);
    }

    // Métodos privados

    // Métodos públicos

    return pu;
})();