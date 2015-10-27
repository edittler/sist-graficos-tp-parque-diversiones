/*
 * Cabina de la vuelta al mundo
 */
function Cabina(velocidadDeGiro, color) {
	ComplexModel.call(this);

	this.velocidadDeGiro = velocidadDeGiro;

	var materialTecho = new ColoredMaterial(color);
	var anchoLargo = 7;
	var alto = 16;
	var espesor = 0.4;
	this.techo = new Box(anchoLargo, espesor, anchoLargo, materialTecho);
	this.techo.translateY(-espesor);

	var materialParedesSuperiores = new ColoredMaterial(color);
	var altoParedesSuperiores = 3;
	this.paredesSuperiores = new ParedCabina(espesor, anchoLargo, anchoLargo,
		altoParedesSuperiores, materialParedesSuperiores);
	this.paredesSuperiores.translateY(-altoParedesSuperiores / 2);

	var materialParedesInferiores = new ColoredMaterial(color);
	var altoParedesInferiores = 6;
	this.paredesInferiores = new ParedCabina(espesor, anchoLargo, anchoLargo,
		altoParedesInferiores, materialParedesInferiores);
	this.paredesInferiores.translateY(-altoParedesSuperiores - 10);

	this.addChild(this.techo);
	this.addChild(this.paredesSuperiores);
	this.addChild(this.paredesInferiores);
	var axis = new Axis();
	axis.scale(20);
	//this.addChild(axis);
}

Cabina.prototype = Object.create(ComplexModel.prototype);
Cabina.prototype.constructor = Cabina;

//@override
Cabina.prototype.update = function (elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);
	this.rotateX(Utils.degToRad(-elapsedTime * this.velocidadDeGiro));
};
