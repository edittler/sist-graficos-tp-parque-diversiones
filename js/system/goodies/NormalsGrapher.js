/*
 * Dibuja los vectores normales a los vértices de una geometría
 */
function NormalsGrapher(model) {
	PrimitiveModel.call(this);
	this.model = model;
}

NormalsGrapher.prototype = Object.create(PrimitiveModel.prototype);
NormalsGrapher.prototype.constructor = NormalsGrapher;

// @override
NormalsGrapher.prototype.prepareToRender = function (gl) {
	var model = this.model;

	this.applyTransformationMatrix(model.getObjectMatrix(), true);
	var modelV = model.geometry.getVertices();
	var modelN = model.geometry.getNormals();

	var vertices = [];
	var indexes = [];
	var colors = [];
	var i;

	for (i = 0; i < modelV.length; i += 3) {
		vertices.push(modelV[i]);
		vertices.push(modelV[i + 1]);
		vertices.push(modelV[i + 2]);

		var n = vec3.fromValues(modelN[i], modelN[i + 1], modelN[i + 2]);
		var v = vec3.fromValues(modelV[i], modelV[i + 1], modelV[i + 2]);

		vec3.scale(n, n, 0.5);
		vec3.add(n, n, v);

		vertices.push(n[0]);
		vertices.push(n[1]);
		vertices.push(n[2]);
	}

	for (i = 0; i < vertices.length / 3; i++) {
		indexes.push(i);
		colors = colors.concat(Color.RED);
	}

	this.setRenderMode(PrimitiveModel.RenderMode.LINES);

	var geometry = new Geometry();
	geometry.setVertices(vertices);
	geometry.setIndexes(indexes);

	var material = new ColoredMaterial();
	material.setColorMappings(colors);
	material.setLightSupport(false);

	this.init(geometry, material);
	PrimitiveModel.prototype.prepareToRender.call(this, gl);
};