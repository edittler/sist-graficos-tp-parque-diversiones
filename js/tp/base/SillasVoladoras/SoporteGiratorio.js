/*
 * Soporte Giratorio
 */
function SoporteGiratorio() {
    this._soporte;
    this._orientation;

    this.constructor();
}

//Metodos
SoporteGiratorio.prototype = (function () {
    var pr = {}; // jshint ignore:line
    var pu = Object.create(ComplexModel.prototype);  // extiende ComplexModel

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._soporte = new Soporte();

        var techo = new Polygon(new Circle(60), new ColoredMaterial(Color.RED));
        techo.translateY(20);
        techo.rotateX(Utils.degToRad(90));

        pu.addChild.call(this, this._soporte);
        pu.addChild.call(this, techo);

        var rotation = 90;
        for(var i=0; i<8; i++) {
            var silla = new Silla(8);
            silla.rotateY(Utils.degToRad(rotation));
            silla.translateZ(50);
            silla.translateY(15);
            silla.rotateX(-Utils.degToRad(15));
            rotation = rotation + 45;
            pu.addChild.call(this, silla);
        }

        this._timePass = 2500;
        this._orientation = 1;
        this._count = 0;

    };

    return pu;
})();

//@override
SoporteGiratorio.prototype.update = function(elapsedTime) {
    ComplexModel.prototype.update.call(this, elapsedTime);
    this.rotateX(Utils.degToRad(this._orientation * 30/200));
    this.rotateY(Utils.degToRad(elapsedTime/80));
    // this.rotateX(Utils.degToRad(this._orientation * elapsedTime/200));
    // if(this._timePass >= 5000) {
        // this._timePass = 0;
        // this._orientation = this._orientation * -1;
    // } else {
        // this._timePass = this._timePass + elapsedTime;
    // }
    if(this._count > 100) {
        this._count = 0;
        this._orientation = this._orientation * -1;
    } else {
        this._count = this._count + 1;
    }
};