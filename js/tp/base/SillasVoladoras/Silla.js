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
    var pr = {}; // jshint ignore:line
    var pu = Object.create(ComplexModel.prototype);

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        var totalHeight = 50;
        var canioHeight = 40;
        var anguloCanio = 90;
        var subcanioHeight = Math.sqrt(Math.pow(this._width/2,2)+Math.pow(totalHeight - canioHeight,2));
        var anguloSubcanio = Math.acos(this._width/2/subcanioHeight);

        this._base = new Box(this._width,this._width,1, new ColoredMaterial(Color.GREY));
        this._base.rotateZ(Utils.degToRad(-90));
        this._base.translateX(this._width/2 + totalHeight);
        this._base.translateY(this._width/2);

        this._respaldo = new Box(this._width,this._width,1, new ColoredMaterial(Color.GREY));
        this._respaldo.translateY(-totalHeight);

        var canio1 = new Canio(canioHeight);
        canio1.translateY(-canioHeight/2);
		canio1.rotateX(Utils.degToRad(anguloCanio));

        var canio2 = new Canio(subcanioHeight);
        canio2.translateY(-canioHeight - (totalHeight - canioHeight)/2);
        canio2.translateZ(-this._width/4);
		canio2.rotateX(-anguloSubcanio);

        var canio3 = new Canio(subcanioHeight);
        canio3.translateY(-canioHeight - (totalHeight - canioHeight)/2);
        canio3.translateZ(this._width/4);
        canio3.rotateX(anguloSubcanio);

        pu.addChild.call(this, this._base);
        pu.addChild.call(this, this._respaldo);
        pu.addChild.call(this, canio1);
        pu.addChild.call(this, canio2);
        pu.addChild.call(this, canio3);

    };

    // Métodos privados

    // Métodos públicos

    return pu;
})();
