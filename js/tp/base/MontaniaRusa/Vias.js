/*
 * Vias
 */
function Vias(path) {
	PrimitiveModel.call(this);

	var circulo = new Circle(1.5);

	var recorrido = new Path(8);
	recorrido.addStretch(new CubicBSpline(path));

	var geometry = new SweptSurface(recorrido, circulo);
	geometry.setClosedShapes(false);
	geometry.setClosedEndings(false);

	this.init(geometry, new ColoredMaterial(Color.GREY));
}

Vias.prototype = Object.create(PrimitiveModel.prototype);
Vias.prototype.constructor = Vias;
