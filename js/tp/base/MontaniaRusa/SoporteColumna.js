/*
 * SoporteColumna
 */
function SoporteColumna() {
	ComplexModel.call(this);

	this.direccion = vec3.fromValues(1.000001, 0.000001, 0.000001);
	vec3.normalize(this.direccion, this.direccion);

	var forma = new TriCircle(1.6);

	var material = new TexturedMaterial("images/metal.jpg");
	material.scale(3, 1);
	material.translate(0, -0.4);
	var geometry = new Polygon(forma, material);
	geometry.rotateX(Utils.degToRad(90));
	geometry.rotateZ(Utils.degToRad(90));

	this.addChild(geometry);
}

SoporteColumna.prototype = Object.create(ComplexModel.prototype);

SoporteColumna.prototype.constructor = SoporteColumna;