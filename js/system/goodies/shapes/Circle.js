/*
 * Círculo
 */
function Circle(radius) {
	Path.call(this, 10);

	var r = radius;
	var c = 0.55191502 * r;
	var curve1 = new CubicBezier([[0, r], [c, r], [r, c], [r, 0]]);
	var curve2 = new CubicBezier([[r, 0], [r, -c], [c, -r], [0, -r]]);
	var curve3 = new CubicBezier([[0, -r], [-c, -r], [-r, -c], [-r, 0]]);
	var curve4 = new CubicBezier([[-r, 0], [-r, c], [-c, r], [0, r]]);

	this.addStretch(curve1);
	this.addStretch(curve2);
	this.addStretch(curve3);
	this.addStretch(curve4);
}

Circle.prototype = Object.create(Path.prototype);
Circle.prototype.constructor = Circle;
