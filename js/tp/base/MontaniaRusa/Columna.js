/*
 * Columna
 */
function Columna(length) {
	PrimitiveModel.call(this);

	var path = [[0,0,0], [0,0,length]];
	var tamanio = 1;
	var forma = new Circle(tamanio);

	var recorrido = new Path(8);
	recorrido.addStretch(new LinearCurve(path));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(true);

	// var material = new ColoredMaterial(Color.GREY);
	var material = new TexturedMaterial("images/metal.jpg");
	material.scale(3, 1);
	material.translate(0, -0.4);

	this.init(geometry, material);
}

Columna.prototype = Object.create(PrimitiveModel.prototype);

Columna.prototype.constructor = Columna;