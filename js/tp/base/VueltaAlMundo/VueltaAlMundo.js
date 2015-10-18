/*
 * Vuelta al mundo
 */
function VueltaAlMundo() {
	ComplexModel.call(this);

	for (var i = 0; i < 12; i++) {
		var angulo = 30;
		var largoCanio = 17;
		var radio = 32;
		var largoCanioTransversal = 10;

		var canioDerecha = new Canio(largoCanio);
		canioDerecha.rotateX(Utils.degToRad(i*angulo));
		canioDerecha.translateY(radio);
		canioDerecha.translateX(-largoCanioTransversal/2);
		canioDerecha.rotateX(Utils.degToRad(angulo/2));
		canioDerecha.translateZ(largoCanio/2);
		this.addChild(canioDerecha);

		var canioLongitudinalDerecha = new Canio(radio);
		canioLongitudinalDerecha.rotateX(Utils.degToRad(i*angulo));
		canioLongitudinalDerecha.translateX(-largoCanioTransversal/2);
		canioLongitudinalDerecha.rotateX(Utils.degToRad(90));
		canioLongitudinalDerecha.translateZ(-radio/2);
		this.addChild(canioLongitudinalDerecha);

		var canioIzquierda = new Canio(largoCanio);
		canioIzquierda.rotateX(Utils.degToRad(i*angulo));
		canioIzquierda.translateY(radio);
		canioIzquierda.translateX(largoCanioTransversal/2);
		canioIzquierda.rotateX(Utils.degToRad(angulo/2));
		canioIzquierda.translateZ(largoCanio/2);
		this.addChild(canioIzquierda);

		var canioLongitudinalIzquierda = new Canio(radio);
		canioLongitudinalIzquierda.rotateX(Utils.degToRad(i*angulo));
		canioLongitudinalIzquierda.translateX(largoCanioTransversal/2);
		canioLongitudinalIzquierda.rotateX(Utils.degToRad(90));
		canioLongitudinalIzquierda.translateZ(-radio/2);
		this.addChild(canioLongitudinalIzquierda);

		if (i % 2 === 0) {
			var canioTransversal = new Canio(largoCanioTransversal);
			canioTransversal.rotateX(Utils.degToRad(i*angulo));
			canioTransversal.translateY(radio);
			canioTransversal.rotateY(Utils.degToRad(90));
			this.addChild(canioTransversal);

			var cabina = new Cabina(Color.BLUE);
			cabina.rotateX(Utils.degToRad(i*angulo));
			cabina.translateY(radio);
			cabina.rotateX(Utils.degToRad(90 - i*angulo));
			this.addChild(cabina);
		}
	}
}

VueltaAlMundo.prototype = Object.create(ComplexModel.prototype);
VueltaAlMundo.prototype.constructor = VueltaAlMundo;

//@override
VueltaAlMundo.prototype.update = function(elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);
	this.rotateX(Utils.degToRad(elapsedTime/80));
};
