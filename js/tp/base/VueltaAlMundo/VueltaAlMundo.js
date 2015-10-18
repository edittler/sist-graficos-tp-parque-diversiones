/*
 * Vuelta al mundo
 */
function VueltaAlMundo() {
	ComplexModel.call(this);

	this.canios = [];
	for (var i = 0; i < 12; i++) {
		var angulo = 30;
		var largoCanio = 15;
		var trasladoCanio = (largoCanio-1.4)*2;
		var largoCanioTransversal = 10;

		var canioDerecha = new Canio(largoCanio);
		canioDerecha.rotateX(Utils.degToRad(i*angulo));
		canioDerecha.translateY(trasladoCanio);
		canioDerecha.translateX(-largoCanioTransversal/2);
		this.addChild(canioDerecha);

		var canioLongitudinalDerecha = new Canio(trasladoCanio + 1);
		canioLongitudinalDerecha.rotateX(Utils.degToRad(i*angulo));
		canioLongitudinalDerecha.translateX(-largoCanioTransversal/2);
		canioLongitudinalDerecha.rotateX(Utils.degToRad(75));
		canioLongitudinalDerecha.translateZ(-trasladoCanio/2);
		this.addChild(canioLongitudinalDerecha);

		var canioIzquierda = new Canio(largoCanio);
		canioIzquierda.rotateX(Utils.degToRad(i*angulo));
		canioIzquierda.translateY(trasladoCanio);
		canioIzquierda.translateX(largoCanioTransversal/2);
		this.addChild(canioIzquierda);

		var canioLongitudinalIzquierda = new Canio(trasladoCanio + 1);
		canioLongitudinalIzquierda.rotateX(Utils.degToRad(i*angulo));
		canioLongitudinalIzquierda.translateX(largoCanioTransversal/2);
		canioLongitudinalIzquierda.rotateX(Utils.degToRad(75));
		canioLongitudinalIzquierda.translateZ(-trasladoCanio/2);
		this.addChild(canioLongitudinalIzquierda);

		if (i % 2 === 0) {
			var canioTransversal = new Canio(largoCanioTransversal);
			canioTransversal.rotateX(Utils.degToRad(i*angulo));
			canioTransversal.translateY(trasladoCanio);
			canioTransversal.rotateY(Utils.degToRad(90));
			canioTransversal.translateX(largoCanio/2);
			this.addChild(canioTransversal);
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
