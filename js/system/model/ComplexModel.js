/*
 * Modelo compuesto de otros modelos hijos
 */
function ComplexModel() {
	Model.call(this);
	this.children = []; // modelos hijos
}

ComplexModel.prototype = Object.create(Model.prototype);
ComplexModel.prototype.constructor = ComplexModel;

// @override
ComplexModel.prototype.prepareToRender = function (gl) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].prepareToRender(gl);
	}
	this.setInitialized(true);
};

// @override
ComplexModel.prototype.setRenderMatrixes = function (mMatrix, vMatrix, pMatrix) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].setRenderMatrixes(mMatrix, vMatrix, pMatrix);
	}
};

// @override
ComplexModel.prototype.setLights = function (gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].setLights(gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos);
	}
};

// @override
ComplexModel.prototype.draw = function (gl) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].draw(gl);
	}
};

// @override
ComplexModel.prototype.callUpdate = function (obj, elapsedTime) {
	Model.prototype.callUpdate.call(this, obj, elapsedTime);

	for (var i = 0; i < this.children.length; i++) {
		this.children[i].callUpdate(this.children[i], elapsedTime);
	}
};

ComplexModel.prototype.addChild = function (child) {
	child.parent = this;
	this.children.push(child);
};
