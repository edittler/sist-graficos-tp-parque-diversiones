/*
 * Vias
 */
function Vias(path) {
	ComplexModel.call(this);

	var material = new TexturedMaterial("images/metal.jpg");
	material.scale(3,1);
	material.translate(0,-0.4);

	var via1 = new Via(path ,1.6, 1, material);
	var via2 = new Via(path ,0.8, 2, material);
	var via3 = new Via(path ,1.6, 3, material);

	this.addChild(via1);
	this.addChild(via2);
	this.addChild(via3);

}

Vias.prototype = Object.create(ComplexModel.prototype);
Vias.prototype.constructor = Vias;
