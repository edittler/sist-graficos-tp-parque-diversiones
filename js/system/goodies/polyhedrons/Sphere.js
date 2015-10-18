/*
 * Esfera
 */
function Sphere(radius, faces, material) {
	PrimitiveModel.prototype.constructor.call(this);

	var r = radius * 0.5;
	var c = 0.55191502 * r;

	var side = new Path(10);
	side.addStretch(new CubicBezier([[0, r], [c, r], [r, c], [r, 0]]));
	side.addStretch(new CubicBezier([[r, 0], [r, -c], [c, -r], [0, -r]]));

	var geometry = new RevolutionSurface(side, faces);
	geometry.setClosedEndings(false);

	this.init(geometry, material);
}

Sphere.prototype = Object.create(PrimitiveModel.prototype);
Sphere.prototype.constructor = Sphere;
