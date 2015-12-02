/*
 * Fondo
 */
function Fondo() {
	ComplexModel.call(this);
	// var material = new ColoredMaterial(Color.SKYBLUE);
	// var images = ["images/beach/front.jpg", "images/beach/back.jpg",
	// 			  "images/beach/bottom.jpg", "images/beach/top.jpg",
	// 			  "images/beach/left.jpg", "images/beach/right.jpg"];
    // material.setShininess(60.0);
	// material.setLightSupport(false);
	//material.scale(0.5, 0.5);
	//material.translate(2.3, 0.4);

	// Prism.call(this, 900, 900, 1200, 24, material);
	// Box.call(this, 2048,2048,1,material);
	// Sprite.call(this, 2048, 2048, material);
	// this.geometry.setClosedEndings(true);

	var frontTexture = new TexturedMaterial("images/beach/front.jpg");
	frontTexture.setLightSupport(false);
	var backTexture = new TexturedMaterial("images/beach/back.jpg");
	backTexture.setLightSupport(false);
	var leftTexture = new TexturedMaterial("images/beach/left.jpg");
	leftTexture.setLightSupport(false);
	var rightTexture = new TexturedMaterial("images/beach/right.jpg");
	rightTexture.setLightSupport(false);
	var topTexture = new TexturedMaterial("images/beach/top.jpg");
	topTexture.setLightSupport(false);

	var size = 2048;
	var front = new Sprite(size, size, frontTexture);
	var back = new Sprite(size, size, backTexture);
	var left = new Sprite(size, size, leftTexture);
	var right = new Sprite(size, size, rightTexture);
	var top = new Sprite(size, size, topTexture);

	front.translateX(size/2);
	front.rotateZ(Utils.degToRad(180));
	front.rotateX(Utils.degToRad(90));
	front.rotateY(Utils.degToRad(90));

	back.translateX(-size/2);
	back.rotateX(Utils.degToRad(90));
	back.rotateY(Utils.degToRad(90));

	left.translateY(-size/2);
	left.rotateZ(Utils.degToRad(180));
	left.rotateX(Utils.degToRad(90));

	right.translateY(size/2);
	right.rotateX(Utils.degToRad(90));

	top.translateZ(size/2);
	top.rotateZ(Utils.degToRad(90));
	top.rotateX(Utils.degToRad(180));

	this.addChild(front);
	this.addChild(left);
	this.addChild(back);
	this.addChild(top);
	this.addChild(right);

}

Fondo.prototype = Object.create(ComplexModel.prototype);

Fondo.prototype.constructor = Fondo;
