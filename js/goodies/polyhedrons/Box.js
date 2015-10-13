/*
 * Caja
 */
function Box(width, height, depth, material) {
	PrimitiveModel.call(this);

	var path = new Path(1);
	path.addStretch(new LinearCurve([[0, 0], [depth, 0]]));

	var rectangle = new Rectangle(width, height);
	var geometry = new SweptSurface(path, rectangle);

	this.init(geometry, material);
}

Box.prototype = Object.create(PrimitiveModel.prototype);

Box.prototype.constructor = Box;
