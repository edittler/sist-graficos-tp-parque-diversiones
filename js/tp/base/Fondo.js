/*
 * Fondo
 */
function Fondo() {
	var material = new ColoredMaterial(Color.SKYBLUE);
	//var material = new TexturedMaterial("images/background.jpg");
	material.setLightSupport(false);
	//material.scale(0.5, 0.5);
	//material.translate(2.3, 0.4);

	Prism.call(this, 900, 900, 1200, 24, material);
	this.geometry.setClosedEndings(false);

	this.rotateX(Utils.degToRad(90));
	this.rotateY(Utils.degToRad(270 + 45));
}

Fondo.prototype = Object.create(Prism.prototype);

Fondo.prototype.constructor = Fondo;
