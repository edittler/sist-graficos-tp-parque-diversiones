/*
 * Estructura giratoria de la "Vuelta al mundo".
 */
function EstructuraGiratoria(ancho) {
	ComplexModel.call(this);

	this.velocidadDeGiro = 1/80;
	this.ancho = ancho;

	var canioPerimetro = function(largo, posX, posZ, anguloPoligono, anguloRotacion) {
		var canio = new Canio(largo);
		canio.rotateX(Utils.degToRad(anguloRotacion));
		canio.translateY(posZ);
		canio.translateX(posX);
		canio.rotateX(Utils.degToRad(anguloPoligono/2));
		canio.translateZ(largo/2);
		return canio;
	};

	var canioLongitudinal = function(largo, posX, anguloRotacion) {
		var canio = new Canio(largo);
		canio.rotateX(Utils.degToRad(anguloRotacion));
		canio.translateX(posX);
		canio.rotateX(Utils.degToRad(90));
		canio.translateZ(-largo/2);
		return canio;
	};

	for (var i = 0; i < 12; i++) {
		var angulo = 30;
		var largoCanio = 17;
		var radio = 32;
		var largoCanioTransversal = this.ancho;

		var canioDerecha = canioPerimetro(largoCanio, -largoCanioTransversal/2,
										  radio, angulo, i*angulo);
		this.addChild(canioDerecha);

		var canioLongDerecha = canioLongitudinal(radio,
												 -largoCanioTransversal/2,
												 i*angulo);
		this.addChild(canioLongDerecha);

		var canioIzquierda = canioPerimetro(largoCanio, largoCanioTransversal/2,
											radio, angulo, i*angulo);
		this.addChild(canioIzquierda);

		var canioLongIzquierda = canioLongitudinal(radio,
												   largoCanioTransversal/2,
												   i*angulo);
		this.addChild(canioLongIzquierda);

		if (i % 2 === 0) {
			var canioTransversal = new Canio(largoCanioTransversal);
			canioTransversal.rotateX(Utils.degToRad(i*angulo));
			canioTransversal.translateY(radio);
			canioTransversal.rotateY(Utils.degToRad(90));
			this.addChild(canioTransversal);

			var cabina = new Cabina(this.velocidadDeGiro, Color.BLUE);
			cabina.rotateX(Utils.degToRad(i*angulo));
			cabina.translateY(radio);
			cabina.rotateX(Utils.degToRad(90 - i*angulo));
			this.addChild(cabina);
		}
	}
}

EstructuraGiratoria.prototype = Object.create(ComplexModel.prototype);
EstructuraGiratoria.prototype.constructor = EstructuraGiratoria;

//@override
EstructuraGiratoria.prototype.update = function(elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);
	this.rotateX(Utils.degToRad(elapsedTime*this.velocidadDeGiro));
};
