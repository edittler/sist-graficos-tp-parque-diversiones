/**
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

// Private
Polygon.prototype.generateMaterialMappings = function () {
	if (this.material.constructor.name === "ColoredMaterial") {
		console.log(this.material.constructor.name);
		this.material.generateMappings(1, this.points.length + 1);
	} else if (this.material.constructor.name === "TexturedMaterial") {
		console.log(this.material.constructor.name);
		var xvalues =  new Float32Array(this.points.length),
			yvalues =  new Float32Array(this.points.length);
		for (var i = 0; i < this.points.length; i++) {
			xvalues[i] = this.points[i][0];
			yvalues[i] = this.points[i][1];
		}
		var xlength = xvalues.max() - xvalues.min();
		var ylength = yvalues.max() - yvalues.min();

		var vertexMapping = [];

		for (var j = 0; j < this.points.length; j++) {
			var n = this.points[j][0];
			var m = this.points[j][1];
			var u = n / xlength;
			var v = m / ylength;

			var vec = vec2.fromValues(u, v);
			//vec2.transformMat3(vec, vec, this.material.transforms);
			vertexMapping = vertexMapping.concat([vec[0], vec[1]]);
		}

		var firstu = xlength / 2;
		var firstv = ylength / 2;
		var firstvec = vec2.fromValues(firstu, firstv);
		//vec2.transformMat3(firstvec, firstvec, this.material.transforms);
		vertexMapping = vertexMapping.concat([firstvec[0], firstvec[1]]);

		this.material.setTextureMappings(vertexMapping);
	}
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

	this.generateMaterialMappings();

	PrimitiveModel.prototype.init.call(this, geometry, this.material);
	PrimitiveModel.prototype.prepareToRender.call(this, gl);
};

/*
    TODO: ver de implementar algún algoritmo de estos:
    http://en.wikipedia.org/wiki/Star-shaped_polygon
    http://en.wikipedia.org/wiki/Polygon_triangulation
    http://stackoverflow.com/questions/471962/how-do-determine-if-a-polygon-is-complex-convex-nonconvex
*/
