/*
 * Canio
 */
function Canio(length) {
	PrimitiveModel.call(this);

	var path = [[0,0,0], [0,0,length]];
	var tamanio = 1;
	var forma = new Rectangle(tamanio, tamanio);

	var recorrido = new Path(8);
	recorrido.addStretch(new LinearCurve(path));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(true);

	this.init(geometry, new ColoredMaterial(Color.GREY));
}

Canio.prototype = Object.create(PrimitiveModel.prototype);

Canio.prototype.constructor = Canio;
