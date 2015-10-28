/*
 * Pared perimetral para la cabina
 */
function ColumnaCabina(espesor, ancho, alto, material) {
	PrimitiveModel.call(this);

	var path = [[ancho, 0, 0], [0, 0, 0], [0, 0, ancho]];
	var forma = new Rectangle(espesor, alto);

	var recorrido = new Path(1);
	recorrido.addStretch(new LinearCurve(path));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(true);

	this.init(geometry, material);
	//this.translateX(ancho/2 - espesor*2);
	//this.translateZ(ancho/2 - espesor*2);
}

ColumnaCabina.prototype = Object.create(PrimitiveModel.prototype);

ColumnaCabina.prototype.constructor = ColumnaCabina;
