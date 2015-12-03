/*
 * Vuelta al mundo
 */
function VueltaAlMundo(material) {
	ComplexModel.call(this);

	var anchoEstructura = 10;
	this.estructuraGiratoria = new EstructuraGiratoria(anchoEstructura);
	this.estructuraGiratoria.translateZ(50);

	var desplazamientoSoporte = anchoEstructura/2 + 2;
	var desplazamientoAlSuelo = -11;
	this.soporteDerecho = new SoporteLateral(material);
	this.soporteDerecho.translateZ(-desplazamientoSoporte);
	this.soporteDerecho.translateY(desplazamientoAlSuelo);

	this.soporteIzquierdo = new SoporteLateral(material);
	this.soporteIzquierdo.translateZ(desplazamientoSoporte);
	this.soporteIzquierdo.translateY(desplazamientoAlSuelo);

	this.addChild(this.estructuraGiratoria);
	this.addChild(this.soporteDerecho);
	this.addChild(this.soporteIzquierdo);
}

VueltaAlMundo.prototype = Object.create(ComplexModel.prototype);
VueltaAlMundo.prototype.constructor = VueltaAlMundo;
