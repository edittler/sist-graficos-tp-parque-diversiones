/*
 * Vias
 */
function Vias(path) {
	ComplexModel.call(this);

	var via = new Via(path ,1.6, Color.GREY);

	this.addChild(via);

}

Vias.prototype = Object.create(ComplexModel.prototype);
Vias.prototype.constructor = Vias;
