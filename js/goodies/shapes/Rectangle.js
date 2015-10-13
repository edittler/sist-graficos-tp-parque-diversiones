/*
 * Rectángulo
 */
function Rectangle(width, height) {
	Path.call(this, 1);
	var rectangle = new LinearCurve([[0, 0], [0, height], [width, height], [width, 0]]);
	this.addStretch(rectangle);
}

Rectangle.prototype = Object.create(Path.prototype);

Rectangle.prototype.constructor = Rectangle;
