/*
 * Cabina de la vuelta al mundo
 */
function Cabina(velocidadDeGiro, color) {
	ComplexModel.call(this);

	this.velocidadDeGiro = velocidadDeGiro;

	var material = new ColoredMaterial(color);
	var anchoLargo = 7;
	var alto = 16;
	this.techo = new Box(anchoLargo, alto, anchoLargo, material);
	this.techo.translateY(-alto/2);

	this.paredesSuperiores;

	this.addChild(this.techo);
}

Cabina.prototype = Object.create(ComplexModel.prototype);
Cabina.prototype.constructor = Cabina;

//@override
Cabina.prototype.update = function(elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);
	this.rotateX(Utils.degToRad(-elapsedTime*this.velocidadDeGiro));
};
