/*
 * Nube de puntos compuesta por secciones que se van agregando
 * entre el [0.0, 1.0] del total de la nube. Todas las secciones
 * deben tener la misma cantidad de puntos.
 */
function PointCloud() {
	this.sections = []; // puntos y kernel de todas las secciones
}

// Métodos privados
PointCloud.prototype.newSection = function (path, at) {
	var strIndex = at.toFixed(2) + "";
	this.sections[strIndex] = [];
	this.sections[strIndex].points = path.getPoints();
	this.sections[strIndex].kernel = path.getKernelPoint();
};

PointCloud.prototype.getSection = function (sectionAt) {
	var keys = Object.keys(this.sections);

	var index = 0;
	for (var i = 0; i < keys.length - 1; i++) {
		var i1 = parseFloat(keys[i]);
		var i2 = parseFloat(keys[i + 1]);

		if (i2 <= sectionAt) {
			index = i2;
		} else {
			index = i1;
			break;
		}
	}

	return this.sections[index.toFixed(2) + ""];
};

PointCloud.prototype.addSection = function (path, at) {
	var initial = this.getSection(0);
	if (Utils.isDefined(initial)) {
		if (path.getPoints().length != initial.points.length) {
			console.error("PointCloud: la sección adicional debe tener la misma cantidad de puntos que la inicial");
			return;
		}

		// at: indica a partir de que parte del camino
		// ubicar la seccion (0: inicio, 1: fin)
		at = at > 1 ? 1 : at;
		this.newSection(path, at);
	} else {
		this.newSection(path, 0);
	}
};

PointCloud.prototype.getSectionPoints = function (sectionAt) {
	return this.getSection(sectionAt).points;
};

PointCloud.prototype.getSectionKernel = function (sectionAt) {
	return this.getSection(sectionAt).kernel;
};

PointCloud.prototype.getKernelPoint = function () {
	var keys = Object.keys(this.sections);

	var kernel = vec3.create();
	for (var i = 0; i < keys.length - 1; i++) {
		vec3.add(kernel, kernel, this.sections[keys[i]].kernel);
	}
	vec3.scale(kernel, kernel, 1 / keys.length);

	return kernel;
};
