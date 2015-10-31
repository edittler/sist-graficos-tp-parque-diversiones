/*
 * Superficie de barrido. Se define una figura inicial y un camino
 * de barrido. En cada punto del camino imprimirá la figura
 * correspondiente. Las figuras que se definan luego deberán tener
 * exactamente la misma cantidad de puntos que la inicial.
 */
function SweptSurface(sweptPath, initialShape) {
	Geometry.call(this);

	this.sweptPath; // recorrido donde se ubican las figuras
	this.shapes; // formas de corte a lo largo del camino

	this.closedShapes = true; // une los puntos iniciales y finales
	this.closedEndings = true; // agrega triangulos en los extremos
	this.centerInKernel = true; // centra el modelo generado en su kernel
	this.type = 0;

	this.init(sweptPath, initialShape);
}

SweptSurface.prototype = Object.create(Geometry.prototype);
SweptSurface.prototype.constructor = SweptSurface;

SweptSurface.prototype.init = function (sweptPath, initialShape) {
	if (Utils.isDefined(sweptPath) && Utils.isDefined(initialShape)) {
		this.shapes = new PointCloud();
		this.sweptPath = sweptPath;
		this.addShape(initialShape, 0);
	}
};

SweptSurface.prototype.setClosedShapes = function (closed) {
	this.closedShapes = closed;
};

SweptSurface.prototype.setClosedEndings = function (closed) {
	this.closedEndings = closed;
};

SweptSurface.prototype.setCenteredInKernel = function (centered) {
	this.centerInKernel = centered;
};

SweptSurface.prototype.addShape = function (shape, at) {
	this.shapes.addSection(shape, at);
};

// @override
SweptSurface.prototype.prepareGeometry = function () {
	var shapes = this.shapes;
	var cloudPointKernel = shapes.getKernelPoint();

	var path = this.sweptPath.getPoints();
	var pathKernel = this.sweptPath.getKernelPoint();

	var nodes = path.length;
	var faces = shapes.getSectionPoints(0).length;

	if (this.closedEndings) {
		nodes += 2;
	}

	if (this.closedShapes) {
		faces++;
	}

	var vertices = [];

	for (var n = 0; n < nodes; n++) {
		var currPointSpace = mat4.create();
		var up = [0, 1, 0];
		var isEnding = this.closedEndings && (n === 0 || n == nodes - 1);
		var currShapePoints;
		var currShapeKernel;

		if (!isEnding) {
			var node = this.closedEndings ? n - 1 : n;
			var totalNodes = nodes - (this.closedEndings ? 2 : 0);

			var actual = vec3.create();
			var next = vec3.create();
			var dir = vec3.create();

			vec3.copy(actual, path[node]);

			if (node < totalNodes - 1) {
				vec3.copy(next, path[node + 1]);
				vec3.subtract(dir, next, actual);
				vec3.normalize(dir, dir);
			} else {
				vec3.subtract(dir, actual, path[node - 1]);
				vec3.normalize(dir, dir);
				var last = vec3.create();
				vec3.add(last, dir, actual);
				next = last;
			}

			if (vec3.distance(up, dir) === 0) {
				// TODO: ver de arreglar este problema. El siguiente link parece util:
				// http://stackoverflow.com/questions/20923232/how-to-rotate-a-vector-by-a-given-direction
				console.error("Error: el recorrido definido tiene dirección igual al vector Up en algún tramo");
				return;
			}

			// desplaza la superficie al centro de coordenadas
			vec3.subtract(actual, actual, pathKernel);
			vec3.subtract(next, next, pathKernel);

			mat4.lookAt(currPointSpace, actual, next, up);
			// se usa la inversa cuando no se trata de una cámara
			mat4.invert(currPointSpace, currPointSpace);

			currShapePoints = shapes.getSectionPoints(node / totalNodes);
			currShapeKernel = shapes.getSectionKernel(node / totalNodes);
		}

		for (var c = 0; c < faces; c++) {
			var vertex = vec3.create();

			if (!isEnding) {
				var kernel = this.centerInKernel ? currShapeKernel : cloudPointKernel;

				var face = this.closedShapes && c == faces - 1 ? 0 : c;
				vec3.subtract(vertex, currShapePoints[face], kernel);
				vec3.transformMat4(vertex, vertex, currPointSpace);
			} else {
				var idx = n === 0 ? 0 : path.length - 1;
				vec3.subtract(vertex, path[idx], pathKernel);
			}

			vertex = [vertex[0], vertex[1], vertex[2]];
			//console.log(vertex);
			vertices = vertices.concat(vertex);
		}
	}

	//console.log(vertices.length);

	this.setVertices(vertices);
	this.defineDimensions(nodes, faces);
};
