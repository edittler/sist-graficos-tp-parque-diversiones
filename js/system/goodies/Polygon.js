/*
 * Poligono 2D plano, convexo (Star-shaped polygon) y centrado en el origen.
 * Recibe una figura (shape) y un color. Es un poliedro de 1 cara.
 */
function Polygon(shape, material) {
	PrimitiveModel.call(this);
	this.points;
	this.kernel;
	this.fill = true; // si es false solo dibuja el contorno
	this.closed = true;

	this.init(shape, material);
}

Polygon.prototype = Object.create(PrimitiveModel.prototype);
Polygon.prototype.constructor = Polygon;

Polygon.prototype.init = function (shape, material) {
	if (Utils.isDefined(shape)) {
		this.points = shape.getPoints();
		this.kernel = shape.getKernelPoint();
		this.material = material;
		this.setInitialized(false);
	}
};

Polygon.prototype.fillPolygon = function (fill) {
	this.fill = fill;
	this.setInitialized(false);
};

Polygon.prototype.closedPolygon = function (closed) {
	this.closed = closed;
	this.setInitialized(false);
};

// @override
Polygon.prototype.prepareToRender = function (gl) {
	var points = this.points;
	var kernel = this.kernel;

	var z = 0;
	var normDir = [0, 0, 1];
	var vertices = [0, 0, z];
	var normals = normDir;
	var indexes = [];

	if (this.fill) {
		indexes = indexes.concat(0);
	}

	for (var p = 0; p < points.length; p++) {
		// se le resta xKernel y yKernel para centrarlo en el origen
		var x = points[p][0] - kernel[0];
		var y = points[p][1] - kernel[1];

		vertices = vertices.concat([x, y, z]);
		normals = normals.concat(normDir);
		indexes = indexes.concat(p + 1);
	}

	if (this.closed) { // une el primer y último punto
		indexes = indexes.concat(1);
	}

	var renderMode = PrimitiveModel.RenderMode.LINE_STRIP;
	if (this.fill) {
		renderMode = PrimitiveModel.RenderMode.TRIANGLE_FAN;
	}

	this.setRenderMode(renderMode);

	var geometry = new Geometry();
	geometry.setVertices(vertices);
	geometry.setNormals(normals);
	geometry.setIndexes(indexes);

	this.material.genetareMappings(1, points.length + 1);

	PrimitiveModel.prototype.init.call(this, geometry, this.material);
	PrimitiveModel.prototype.prepareToRender.call(this, gl);
};

/*
    TODO: ver de implementar algún algoritmo de estos:
    http://en.wikipedia.org/wiki/Star-shaped_polygon
    http://en.wikipedia.org/wiki/Polygon_triangulation
    http://stackoverflow.com/questions/471962/how-do-determine-if-a-polygon-is-complex-convex-nonconvex
*/
