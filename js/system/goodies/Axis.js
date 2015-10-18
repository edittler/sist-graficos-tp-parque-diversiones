/*
 * Ejes coordenados
 */
function Axis() {
	PrimitiveModel.call(this);

	var vertices = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1];
	var indexes = [0, 1, 2, 3, 4, 5];
	var colors = [];

	colors = colors.concat(Color.RED);
	colors = colors.concat(Color.RED);
	colors = colors.concat(Color.GREEN);
	colors = colors.concat(Color.GREEN);
	colors = colors.concat(Color.BLUE);
	colors = colors.concat(Color.BLUE);

	this.setRenderMode(PrimitiveModel.RenderMode.LINES);

	var geometry = new Geometry();
	geometry.setVertices(vertices);
	geometry.setIndexes(indexes);

	var material = new ColoredMaterial();
	material.setColorMappings(colors);
	material.setLightSupport(false);

	this.init.call(this, geometry, material);
}

Axis.prototype = Object.create(PrimitiveModel.prototype);
Axis.prototype.constructor = Axis;
