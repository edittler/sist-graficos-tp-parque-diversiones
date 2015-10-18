/*
 * Vuelta al mundo
 */
function VueltaAlMundo() {
	ComplexModel.call(this);

	this.canios = [];
	for (var i = 0; i < 15; i++) {
		var largoCanio = 15;
		var trasladoCanio = (largoCanio + 2.4)*2;
		var largoCanioTransversal = 10;

		var canioDerecha = new Canio(largoCanio);
		canioDerecha.rotateX(Utils.degToRad(i*24));
		canioDerecha.translateY(trasladoCanio);
		canioDerecha.translateX(-largoCanioTransversal/2);
		this.addChild(canioDerecha);

		var canioLongitudinalDerecha = new Canio(trasladoCanio);
		canioLongitudinalDerecha.rotateX(Utils.degToRad(i*24));
		canioLongitudinalDerecha.translateX(-largoCanioTransversal/2);
		canioLongitudinalDerecha.rotateX(Utils.degToRad(78));
		canioLongitudinalDerecha.translateZ(-trasladoCanio/2);
		this.addChild(canioLongitudinalDerecha);

		var canioIzquierda = new Canio(largoCanio);
		canioIzquierda.rotateX(Utils.degToRad(i*24));
		canioIzquierda.translateY(trasladoCanio);
		canioIzquierda.translateX(largoCanioTransversal/2);
		this.addChild(canioIzquierda);

		var canioLongitudinalIzquierda = new Canio(trasladoCanio);
		canioLongitudinalIzquierda.rotateX(Utils.degToRad(i*24));
		canioLongitudinalIzquierda.translateX(largoCanioTransversal/2);
		canioLongitudinalIzquierda.rotateX(Utils.degToRad(78));
		canioLongitudinalIzquierda.translateZ(-trasladoCanio/2);
		this.addChild(canioLongitudinalIzquierda);

		if (i % 2 === 0 && i < 14) {
			var canioTransversal = new Canio(largoCanioTransversal);
			canioTransversal.rotateX(Utils.degToRad(i*24));
			canioTransversal.translateY(trasladoCanio);
			canioTransversal.rotateY(Utils.degToRad(90));
			canioTransversal.translateX(largoCanio/2);
			this.addChild(canioTransversal);
		}
		
	}
	

}

VueltaAlMundo.prototype = Object.create(ComplexModel.prototype);

VueltaAlMundo.prototype.constructor = VueltaAlMundo;