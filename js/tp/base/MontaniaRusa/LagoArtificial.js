/*
 * Lago Artificial
 */
function LagoArtificial() {
	ComplexModel.call(this);

	var puntosControl = [
		[40, 30, 0],
		[20, 10, 0],
		[10, 70, 0],
		[40, 50, 0],
		[50, 60, 0],
		[70, 80, 0],
		[80, 60, 0],
		[70, 50, 0],
		[70, 30, 0],
		[80, 20, 0],
		[70, 10, 0],
		[50, 30, 0],
		[40, 30, 0],
		[20, 10, 0],
		[10, 70, 0]
	];

	var forma = new Path(8);
	forma.addStretch(new CubicBSpline(puntosControl));

	var recorrido = new Path(10);
	var caminoBarrido = [[0,0,0], [0,0,10]];
	recorrido.addStretch(new LinearCurve(caminoBarrido));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(true);
	var model = new PrimitiveModel(geometry, new ColoredMaterial(Color.CORNFLOWERBLUE));

	this.addChild(model);
	this.translateX(100);
	this.translateY(-200);
	this.translateZ(-50);
	this.scale(2);
}

LagoArtificial.prototype = Object.create(ComplexModel.prototype);
LagoArtificial.prototype.constructor = LagoArtificial;