/*
 * Fondo
 */
function Fondo() {
	// var material = new ColoredMaterial(Color.SKYBLUE);
	var material = new TexturedMaterial("images/grass_texture.jpg");
	var images = ["images/beach/front.jpg", "images/beach/back.jpg",
				  "images/beach/bottom.jpg", "images/beach/top.jpg",
				  "images/beach/left.jpg", "images/beach/right.jpg"];
	material.setCubeMap(images, 2.0);
    // material.setShininess(60.0);
	// material.setLightSupport(false);
	//material.scale(0.5, 0.5);
	//material.translate(2.3, 0.4);

	// Prism.call(this, 900, 900, 1200, 24, material);
	Box.call(this, 900,900,900,material);
	this.geometry.setClosedEndings(true);

	this.rotateX(Utils.degToRad(90));
	this.rotateY(Utils.degToRad(270 + 45));
}

Fondo.prototype = Object.create(Box.prototype);

Fondo.prototype.constructor = Fondo;
