/*
 * TriCírculo
 */
function TriCircle(radius) {
	Path.call(this, 10);

	var circle1 = new Circle(radius);
	var circle2 = new Circle(radius/2);
	var circle3 = new Circle(radius);

	circle1.translateY(10);
	circle2.translateX(-5);
	circle3.translateY(-10);

	this.addStretch(circle1);
	this.addStretch(circle2);
	this.addStretch(circle3);	

}

TriCircle.prototype = Object.create(Path.prototype);
TriCircle.prototype.constructor = TriCircle;
