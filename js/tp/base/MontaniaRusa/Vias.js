/*
 * Vias
 */
function Vias(path) {
	ComplexModel.call(this);

	var via1 = new Via(path);
	via1.translate(-104, -60, -8);
	via1.rotateX(Utils.degToRad(90));

	via2 = new Via(path);
    via2.translate(-90, -60, -8);
    via2.rotateX(Utils.degToRad(90));

	this.addChild(via1);
	this.addChild(via2);
}

Vias.prototype = Object.create(ComplexModel.prototype);
Vias.prototype.constructor = Vias;
