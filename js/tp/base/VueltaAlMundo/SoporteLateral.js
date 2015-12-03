/*
 * Soporte de la Vuelta al mundo
 */
function SoporteLateral(material) {
	PrimitiveModel.call(this);

	var alto = 65;
	var path = [[0,0,0], [0,0,1]];
	var forma = new Trapezoid(20, 2, alto);

	var recorrido = new Path(2);
	recorrido.addStretch(new LinearCurve(path));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(true);

	this.init(geometry, material);
	this.rotateY(Utils.degToRad(90));
	this.rotateZ(Utils.degToRad(90));
	this.translateY(alto/2);
}

SoporteLateral.prototype = Object.create(PrimitiveModel.prototype);
SoporteLateral.prototype.constructor = SoporteLateral;
