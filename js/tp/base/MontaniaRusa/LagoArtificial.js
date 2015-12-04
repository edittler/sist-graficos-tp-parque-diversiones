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

	// Armo las paredes del lago
	var forma = new Path(8);
	forma.addStretch(new CubicBSpline(puntosControl));

	var recorrido = new Path(10);
	var caminoBarrido = [[0,0,0], [0,0,10]];
	recorrido.addStretch(new LinearCurve(caminoBarrido));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(false);
	var model = new PrimitiveModel(geometry, new ColoredMaterial(Color.CORNFLOWERBLUE));

	// Armo la superficie del lago
	var material = new TexturedMaterial("images/water_texture.jpg");
	material.scale(20.0, 20.0);
	material.usingWaterEffect = true;
	this.agua = new Polygon(forma, material);
	this.agua.translateZ(5);
	this.agua.rotateY(Utils.degToRad(180));
	this.agua.time = 0;

	var material2 = new TexturedMaterial("images/water_texture.jpg");
	material2.scale(20.0, 20.0);
	material2.usingWaterEffect = true;
	this.agua2 = new Sprite(100, 100, material2);
	this.agua2.translateZ(-20);
	this.agua2.rotateY(Utils.degToRad(180));
	this.agua2.time = 0;

	// Agrego las partes al lago
	this.addChild(model);
	this.addChild(this.agua);
	this.addChild(this.agua2);
	this.translateX(50);
	this.translateY(-100);
	//this.translateZ(-50);
	this.scale(2);
}

LagoArtificial.prototype = Object.create(ComplexModel.prototype);
LagoArtificial.prototype.constructor = LagoArtificial;

LagoArtificial.prototype.update = function (elapsedTime) {
	this.agua.time += elapsedTime;
	this.agua2.time += elapsedTime;
};
