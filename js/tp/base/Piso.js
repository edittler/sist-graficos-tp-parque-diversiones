function Piso() {
	//this.cuerpoRigido;
	this.groundMaterial;

	var pisoSize = 1000;

	var material = new ColoredMaterial(Color.GREY);
	//var material = new TexturedMaterial("images/superficie.jpg");
	//material.setNormalMap("images/superficie-normalmap.jpg");

	Sprite.call(this, pisoSize, pisoSize, material);

	this.translateZ(-10);

	/*
	// TODO creo que acá es en y = -10
	// Plano del Suelo, ubicado en z = -10
	this.groundMaterial = new CANNON.Material("groundMaterial");
	var groundShape = new CANNON.Plane();
	// masa 0 implica que el cuerpo tiene masa infinita
	this.cuerpoRigido = new CANNON.RigidBody(0, groundShape, this._groundMaterial);
	this.cuerpoRigido.useQuaternion = true;
	this.cuerpoRigido.position.z = ConstantesTanque.ALTURA_PISO;
	*/
}

Piso.prototype = Object.create(Sprite.prototype);

Piso.prototype.constructor = Piso;

/*
Piso.prototype.getCuerpoRigido = function () {
	return this.cuerpoRigido;
};

Piso.prototype.getMaterial = function () {
	return this.groundMaterial;
};
*/
