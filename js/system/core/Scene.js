/*
 * Contiene e inicializa modelos para luego dibujarlos
 */
function Scene() {
	Transformable.call(this);
	this.models = []; // modelos en la escena
	this.auto;

	//TODO: poner esto en una clase tipo Light cuando se tenga un
	// shader capaz de agregar más de una fuente de luz
	this.hasLight = false; // si es false usa iluminacion por defecto
	this.ambientIntensity;
	this.directionalIntensity;
	this.lightPosition;

	this.carLightColor;
	this.carLightPosition;
	this.carLightDirection;
}

Scene.prototype = Object.create(Transformable.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.prepareModels = function (gl) {
	var models = this.models;
	for (var i = 0; i < models.length; i++) {
		if (!models[i].isInitialized()) {
			models[i].prepareToRender(gl);
		}
	}
};

Scene.prototype.setLightSources = function (amb, dir, pos, carLightColor, carLightPosition, carLightDirection) {
	this.hasLight = true;

	this.ambientIntensity = amb;
	this.directionalIntensity = dir;
	this.lightPosition = vec3.fromValues(pos[0], pos[1], pos[2]);

	this.carLightColor = carLightColor;
	this.carLightPosition = vec3.fromValues(carLightPosition[0], carLightPosition[1], carLightPosition[2]);
	this.carLightDirection = vec3.fromValues(carLightDirection[0], carLightDirection[1], carLightDirection[2]);
};

Scene.prototype.add = function (model) {
	// Agrega un modelo a la escena
	this.models.push(model);
};

Scene.prototype.draw = function (gl, camera) {
	// Prepara los modelos para dibujarlos
	this.prepareModels(gl);

	var models = this.models;
	var mMatrix = this.objectMatrix;
	var vMatrix = camera.getViewMatrix();
	var pMatrix = camera.getProjectionMatrix();

	var carMatrix;
	if (this.auto) {
		carMatrix = this.auto.getObjectMatrix();
	} else {
		carMatrix = mat4.create();
	}

	var pos = camera.getAlignedWithCamera(this.lightPosition);
	vec3.transformMat4(pos, pos, mMatrix);

	var transformedCarLight = vec3.create();
	vec3.transformMat4(transformedCarLight, this.carLightPosition, carMatrix);
	transformedCarLight = camera.getAlignedWithCamera(transformedCarLight);
	vec3.transformMat4(transformedCarLight, transformedCarLight, mMatrix);

	var transformedCarLightDirection = vec3.create();

	// direction = pos2 - this.carLightPosition
	// pos2 = direction + this.carLightPostion
	var pos2 = vec3.create();
	vec3.add(pos2, this.carLightPosition, this.carLightDirection);
	vec3.transformMat4(pos2, pos2, carMatrix);
	pos2 = camera.getAlignedWithCamera(pos2);
	vec3.transformMat4(pos2, pos2, mMatrix);

	vec3.subtract(transformedCarLightDirection, pos2, transformedCarLight);
	vec3.normalize(transformedCarLightDirection, transformedCarLightDirection);

	var ambient, directional;
	if (this.hasLight) {
		ambient = this.ambientIntensity;
		directional = this.directionalIntensity;
	}

	for (var i = 0; i < models.length; i++) {
		if (this.hasLight) {
			models[i].setLights(gl, ambient, directional, pos, this.carLightColor, transformedCarLight, transformedCarLightDirection);
		}
		models[i].setRenderMatrixes(mMatrix, vMatrix, pMatrix);
		models[i].draw(gl);
	}
};

Scene.prototype.update = function (elapsedTime) {
	var models = this.models;

	for (var i = 0; i < models.length; i++) {
		models[i].callUpdate(models[i], elapsedTime);
	}
};

Scene.prototype.setAuto = function (auto) {
	this.auto = auto;
};
