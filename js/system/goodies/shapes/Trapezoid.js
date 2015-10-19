/*
 * Trapecio
 */
function Trapezoid(longSide, shortSide, height) {
	Path.call(this, 1);
	var halfLongSide = longSide/2;
	var halfShortSide = shortSide/2;
	var trapezoid = new LinearCurve([[-halfLongSide, 0],
									 [-halfShortSide, height],
									 [halfShortSide, height],
									 [halfLongSide, 0]]);
	this.addStretch(trapezoid);
}

Trapezoid.prototype = Object.create(Path.prototype);
Trapezoid.prototype.constructor = Trapezoid;
