/*
 * Cabina de la vuelta al mundo
 */
function Cabina(velocidadDeGiro, color) {
	ComplexModel.call(this);

	this.velocidadDeGiro = velocidadDeGiro;

	var anchoLargo = 7;
	var espesor = 0.2;

	var materialTecho = new ColoredMaterial(color);
	this.techo = new Box(anchoLargo, espesor, anchoLargo, materialTecho);
	this.techo.translateY(espesor);

	var materialParedesSuperiores = new ColoredMaterial(color);
	var altoParedesSuperiores = 3;
	this.paredesSuperiores = new ParedCabina(espesor, anchoLargo, anchoLargo,
		altoParedesSuperiores, materialParedesSuperiores);
	this.paredesSuperiores.translateY(espesor - (altoParedesSuperiores / 2));
	//this.paredesSuperiores.translateX(-espesor);
	//this.paredesSuperiores.translateZ(espesor);

	var generadorColumna = function (espesor, ancho, alto, color, angulo, posX, posY, posZ) {
		var materialColumna = new ColoredMaterial(color);
		var columna = new ColumnaCabina(espesor, ancho, alto, materialColumna);
		columna.translateZ(posZ);
		columna.translateX(posX);
		columna.translateY(posY);
		columna.rotateY(Utils.degToRad(angulo));
		var complexModel = new ComplexModel();
		complexModel.addChild(columna);
		var axis = new Axis();
		axis.translateZ(posZ);
		axis.translateX(posX);
		axis.translateY(posY);
		axis.rotateY(Utils.degToRad(angulo));
		complexModel.addChild(axis);
		//return columna;
		return complexModel;
	};
	var anchoColumna = 2;
	var altoColumna = 10;
	var posYColumna = -altoParedesSuperiores - (altoColumna / 2) + espesor;
	var traslacion = anchoLargo / 2 - anchoColumna / 4;

	this.columna1 = generadorColumna(espesor, anchoColumna, altoColumna, color,
		0, -traslacion, posYColumna, -traslacion);

	this.columna2 = generadorColumna(espesor, anchoColumna, altoColumna, color,
		90, -traslacion, posYColumna, traslacion);

	this.columna3 = generadorColumna(espesor, anchoColumna, altoColumna, color,
		-90, traslacion, posYColumna, -traslacion);

	this.columna4 = generadorColumna(espesor, anchoColumna, altoColumna, color,
		180, traslacion, posYColumna, traslacion);

	var materialParedesInferiores = new ColoredMaterial(color);
	var altoParedesInferiores = 6;
	this.paredesInferiores = new ParedCabina(espesor, anchoLargo, anchoLargo,
		altoParedesInferiores, materialParedesInferiores);
	this.paredesInferiores.translateY(espesor - altoParedesSuperiores - altoColumna - (altoParedesInferiores / 2));

	var materialPiso = new ColoredMaterial(color);
	this.piso = new Box(anchoLargo, espesor, anchoLargo, materialPiso);
	this.piso.translateY(espesor * 2 - altoParedesSuperiores - altoColumna - altoParedesInferiores);

	this.addChild(this.techo);
	this.addChild(this.paredesSuperiores);
	this.addChild(this.columna1);
	this.addChild(this.columna2);
	this.addChild(this.columna3);
	this.addChild(this.columna4);
	this.addChild(this.paredesInferiores);
	this.addChild(this.piso);
	var axis = new Axis();
	axis.scale(20);
	this.addChild(axis);
}

Cabina.prototype = Object.create(ComplexModel.prototype);
Cabina.prototype.constructor = Cabina;

//@override
Cabina.prototype.update = function (elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);
	this.rotateX(Utils.degToRad(-elapsedTime * this.velocidadDeGiro));
};
