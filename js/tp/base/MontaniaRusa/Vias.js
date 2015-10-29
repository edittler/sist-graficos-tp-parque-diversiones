/*
 * Vias
 */
function Vias(path) {
	ComplexModel.call(this);

	var via1 = new Via(path);
	via1.translate(-104, -60, 50);

	via2 = new Via(path);
    via2.translate(-90, -60, 50);

	this.addChild(via1);
	this.addChild(via2);
}

Vias.prototype = Object.create(ComplexModel.prototype);
Vias.prototype.constructor = Vias;
