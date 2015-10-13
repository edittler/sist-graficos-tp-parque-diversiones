/*
 * Geometría base de vértices y tríangulos.
 */
function Geometry() {
	this.vertices = [];
	this.indexes = [];
	this.triangles = [];

	this.normals = [];
	this.tangents = [];

	this.type;

	this.levels = 0; // nro de vertices a lo largo
	this.faces = 0; // nro de vertices a lo ancho
}

Geometry.prototype.calculateIndexes = function (levels, faces) {
	if (levels == 0 || faces == 0) {
		alert("Error: no se definieron las dimensiones de la geometria");
		return;
	}

	var indexes = [];

	for (var n = 1; n < levels; n++) {
		for (var c = 0; c < faces; c++) {
			var v1, v2;

			if (n % 2) {
				v1 = (n - 1) * faces + c;
				v2 = n * faces + c;
			} else {
				v1 = n * faces - (c + 1);
				v2 = (n + 1) * faces - (c + 1);
			}

			indexes = indexes.concat([v1, v2]);

			if (c == faces - 1) {
				indexes = indexes.concat(v2);
			}
		}
	}

	this.indexes = indexes;

	// Genero explicitamente los indices de los triangles strip
	for (var i = 0; i < (this.indexes.length) - 2; i++) {
		var triangle = vec3.fromValues(this.indexes[i],
			this.indexes[i + 1], this.indexes[i + 2]);
		this.triangles.push(triangle);
	}
};

Geometry.prototype.calculateNormals = function () {
	// Normales de cada triangulo en el mismo orden que aparecen
	var triangleNormals = [];

	// Normales de cada vertice, se inicializan en 0,0,0
	var vertexNormals = [];

	for (var i = 0; i < this.indexes.length; i++) {
		var zero = vec3.fromValues(0, 0, 0);
		vertexNormals.push(zero);
	}

	// Calcular normales de cada triangulo
	for (var i = 0; i < this.triangles.length; i++) {

		// Obtengo las coordenadas de cada vertice del triangulo
		var indexV1 = this.triangles[i][0];
		var v1x = this.vertices[indexV1 * 3];
		var v1y = this.vertices[(indexV1 * 3) + 1];
		var v1z = this.vertices[(indexV1 * 3) + 2];
		var v1 = vec3.fromValues(v1x, v1y, v1z);

		var indexV2 = this.triangles[i][1];
		var v2x = this.vertices[indexV2 * 3];
		var v2y = this.vertices[(indexV2 * 3) + 1];
		var v2z = this.vertices[(indexV2 * 3) + 2];
		var v2 = vec3.fromValues(v2x, v2y, v2z);

		var indexV3 = this.triangles[i][2];
		var v3x = this.vertices[indexV3 * 3];
		var v3y = this.vertices[(indexV3 * 3) + 1];
		var v3z = this.vertices[(indexV3 * 3) + 2];
		var v3 = vec3.fromValues(v3x, v3y, v3z);

		var vector1 = vec3.create();
		var vector2 = vec3.create();
		var normal = vec3.create();

		// Calculo la normal
		vec3.subtract(vector1, v2, v1);
		vec3.subtract(vector2, v3, v1);

		if (this.type == 1 || this.type == 2) {

			if (i % 2 == 0) {
				// triangulos contra reloj
				vec3.cross(normal, vector1, vector2);
			} else {
				// triangulos a favor del reloj
				vec3.cross(normal, vector2, vector1);
			}
		} else if (this.type == 0) {
			if (i % 2 == 0) {
				// triangulos contra reloj
				vec3.cross(normal, vector2, vector1);
			} else {
				// triangulos a favor del reloj
				vec3.cross(normal, vector1, vector2);
			}
		}

		vec3.normalize(normal, normal);

		triangleNormals.push(normal);

		// Acumulo normales de los vertices correspondientes
		vec3.add(vertexNormals[indexV1], vertexNormals[indexV1], normal);
		vec3.add(vertexNormals[indexV2], vertexNormals[indexV2], normal);
		vec3.add(vertexNormals[indexV3], vertexNormals[indexV3], normal);
	}

	if (this.type == 2) {
		for (var i = 0; i < vertexNormals.length; i++) {
			var normal = vertexNormals[i];

			vec3.normalize(normal, normal);
			if (normal[1] > 0) {
				this.normals.push(0);
				this.normals.push(1);
				this.normals.push(0);
			} else if (normal[1] == 0) {
				this.normals.push(normal[0]);
				this.normals.push(normal[1]);
				this.normals.push(normal[2]);
			} else {
				this.normals.push(0);
				this.normals.push(-1);
				this.normals.push(0);
			}

		}
	} else {
		// Normalizar normales de cada vertice
		for (var i = 0; i < vertexNormals.length; i++) {
			var normal = vertexNormals[i];

			vec3.normalize(normal, normal);

			this.normals.push(normal[0]);
			this.normals.push(normal[1]);
			this.normals.push(normal[2]);
		}
	}
};

Geometry.prototype.setVertices = function (vertices) {
	this.vertices = vertices;
};

Geometry.prototype.setIndexes = function (indexes) {
	this.indexes = indexes;
};

Geometry.prototype.setNormals = function (normals) {
	this.normals = normals;
};

Geometry.prototype.setTangents = function (tangents) {
	this.tangents = tangents;
};

Geometry.prototype.defineDimensions = function (levels, faces) {
	this.levels = levels;
	this.faces = faces;
};

Geometry.prototype.prepareGeometry = function () {
	// Este método será llamado en el momento de la
	// inicialización de la geometría
};

Geometry.prototype.getVertices = function () {
	return this.vertices;
};

Geometry.prototype.getIndexes = function () {
	if (this.indexes.length == 0) {
		this.calculateIndexes(this.levels, this.faces);
	}

	return this.indexes;
};

Geometry.prototype.getNormals = function () {
	if (this.normals.length == 0) {
		this.calculateNormals();
	}
	return this.normals;
};

Geometry.prototype.getTangents = function () {
	if (this.tangents.length == 0) {
		var n = this.normals;

		for (var i = 0; i < n.length; i += 3) {
			var normal = vec3.fromValues(n[i], n[i + 1], n[i + 2]);
			var tangent = vec3.create();

			var c1 = vec3.create();
			var c2 = vec3.create();

			vec3.cross(c1, normal, vec3.fromValues(0.0, 0.0, 1.0));
			vec3.cross(c2, normal, vec3.fromValues(0.0, 1.0, 0.0));

			if (vec3.len(c1) > vec3.len(c2)) {
				tangent = vec3.clone(c1);
			} else {
				tangent = vec3.clone(c2);
			}

			vec3.normalize(tangent, tangent);
			tangent = [tangent[0], tangent[1], tangent[2]];
			this.tangents = this.tangents.concat(tangent);
		}
	}
	return this.tangents;
};

Geometry.prototype.invertNormals = function () {
	// invierte el type para que calcule las normales del otro tipo
	this.type = 1 - this.type;
};