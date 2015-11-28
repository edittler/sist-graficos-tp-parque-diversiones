function Piso() {
	var pisoSize = 2000;

	var material = new TexturedMaterial("images/green-grass-texture.jpg");
	material.setNormalMap("images/green-grass-normalmap.jpg");
	material.scale(28.0, 28.0);

	Sprite.call(this, pisoSize, pisoSize, material);

	this.translateZ(-10);
}

Piso.prototype = Object.create(Sprite.prototype);
Piso.prototype.constructor = Piso;
