/*
    Silla
*/
function Silla(width) {
	this._base;
	this._respaldo;
	this._width = width;
    this.constructor();
}

// Métodos
Silla.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        var canioHeight = 50;
        var anguloCanio = 70;

        this._base = new Box(this._width,this._width,1, new ColoredMaterial(Color.GREY));
        this._base.rotateZ(Utils.degToRad(-90));
        this._base.translateX(this._width/2 + canioHeight*Math.cos(Utils.degToRad(anguloCanio)) + this._width);
        this._base.translateY(this._width/2);

        this._respaldo = new Box(this._width,this._width,1, new ColoredMaterial(Color.GREY));
        this._respaldo.translateY(-canioHeight*Math.cos(Utils.degToRad(anguloCanio)) - this._width);

        var canio1 = new Canio(canioHeight);
		canio1.translateY(-canioHeight*Math.cos(Utils.degToRad(anguloCanio))/2);
		canio1.rotateX(Utils.degToRad(anguloCanio));

        var canio2 = new Canio(canioHeight);
		canio2.translateY(-canioHeight*Math.cos(Utils.degToRad(anguloCanio))/2);
		canio2.rotateX(-Utils.degToRad(anguloCanio));

        pu.addChild.call(this, this._base);
        pu.addChild.call(this, this._respaldo);
        pu.addChild.call(this, canio1);
        pu.addChild.call(this, canio2);
    }

    // Métodos privados

    // Métodos públicos

    return pu;
})();