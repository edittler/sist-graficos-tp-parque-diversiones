/*
 * Vias
 */
function Vias(path) {
	ComplexModel.call(this);

	var via1 = new Via(path ,1.6, 1, Color.GREY);
	var via2 = new Via(path ,0.8, 2, Color.GREY);
	var via3 = new Via(path ,1.6, 3, Color.GREY);

	this.addChild(via1);
	this.addChild(via2);
	this.addChild(via3);

}

Vias.prototype = Object.create(ComplexModel.prototype);
Vias.prototype.constructor = Vias;
