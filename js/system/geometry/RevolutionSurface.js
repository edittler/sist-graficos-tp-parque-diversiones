/*
 * Superficie de revolución. Se define una forma inicial de barrido
 * sobre el eje y la cantidad de caras. En cada angulo rotado imprimirá
 * el borde correspondiente. Los bordes que se definan luego deberán
 * tener exactamente la misma cantidad de puntos que el inicial.
 */
function RevolutionSurface(initialSideForm, faces) {
	Geometry.call(this);
	this.sideForms; // formatos de barrido de la revolución

	this.numbFaces; // cantidad de caras (mínimo 3)

	this.closedEndings = true; // agrega triángulos en los extremos
	this.centerInKernel = true; // centra el modelo generado en su kernel
	this.type = 1;

	this.init(initialSideForm, faces);
}

RevolutionSurface.prototype = Object.create(Geometry.prototype);

RevolutionSurface.prototype.constructor = RevolutionSurface;

RevolutionSurface.prototype.init = function (initialSideForm, faces) {
	if (Utils.isDefined(initialSideForm)) {
		this.sideForms = new PointCloud();
		this.numbFaces = faces < 3 ? 3 : faces;
		this.addSideForm(initialSideForm, 0);
	}
};

RevolutionSurface.prototype.setClosedEndings = function (closed) {
	this.closedEndings = closed;
};

RevolutionSurface.prototype.setCenteredInKernel = function (centered) {
	this.centerInKernel = centered;
};

RevolutionSurface.prototype.addSideForm = function (sideForm, at) {
	this.sideForms.addSection(sideForm, at);
};

// @override
RevolutionSurface.prototype.prepareGeometry = function () {
	var sideForms = this.sideForms;
	var cloudPointKernel = sideForms.getKernelPoint();

	var faces = this.numbFaces;
	var nodes = sideForms.getSectionPoints(0).length;

	if (this.closedEndings) {
		nodes += 2;
	}

	var angle = (2 * Math.PI) / faces;

	var vertices = [];

	for (var c = 0; c <= faces; c++) {
		// la revolucion se realiza sobre el eje Y
		var currPointSpace = mat4.create();
		mat4.rotate(currPointSpace, currPointSpace, angle * c, [0, 1, 0]);

		var currSideFormPoints = sideForms.getSectionPoints(c / faces);
		var currSideFormKernel = sideForms.getSectionKernel(c / faces);

		for (var n = 0; n < nodes; n++) {
			var vertex = vec3.create();
			var isEnding = this.closedEndings && (n == 0 || n == nodes - 1);
			var kernel = this.centerInKernel ? currSideFormKernel : cloudPointKernel;

			if (!isEnding) {
				var node = this.closedEndings ? n - 1 : n;
				var ykernel = vec3.fromValues(0, kernel[1], 0);
				vec3.subtract(vertex, currSideFormPoints[node], ykernel);
			} else {
				var idx = n == 0 ? 0 : nodes - 3;
				vec3.set(vertex, 0, currSideFormPoints[idx][1] - kernel[1], 0);
			}

			vec3.transformMat4(vertex, vertex, currPointSpace);
			vertex = [vertex[0], vertex[1], vertex[2]];
			//console.log(vertex);
			vertices = vertices.concat(vertex);
		}
	}

	//console.log(vertices.length);

	this.setVertices(vertices);
	this.defineDimensions(faces + 1, nodes);
};
