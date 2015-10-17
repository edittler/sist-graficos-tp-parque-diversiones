/*
 * Rectangulo plano con un material aplicado
 */
function Sprite(width, height, material) {
	PrimitiveModel.call(this);

	var w = width;
	var h = height;
	var vertices = [-w / 2, -h / 2, 0, -w / 2, h / 2, 0, w / 2, -h / 2, 0, w / 2, h / 2, 0];
	var indexes = [0, 1, 2, 3];
	var normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
	var tangents = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];

	var geometry = new Geometry();
	geometry.setVertices(vertices);
	geometry.setIndexes(indexes);
	geometry.setNormals(normals);
	geometry.setTangents(tangents);
	geometry.defineDimensions(2, 2);

	this.init(geometry, material);
}

Sprite.prototype = Object.create(PrimitiveModel.prototype);

Sprite.prototype.constructor = Sprite;
