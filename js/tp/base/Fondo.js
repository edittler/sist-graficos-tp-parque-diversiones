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

	var front = new Sprite(2048,2048,new TexturedMaterial("images/beach/front.jpg"));
	var back = new Sprite(2048,2048,new TexturedMaterial("images/beach/back.jpg"));
	var left = new Sprite(2048,2048,new TexturedMaterial("images/beach/left.jpg"));
	var right = new Sprite(2048,2048,new TexturedMaterial("images/beach/right.jpg"));
	var top = new Sprite(2048,2048,new TexturedMaterial("images/beach/top.jpg"));

	front.translateX(1024);
	front.rotateZ(Utils.degToRad(180));
	front.rotateX(Utils.degToRad(90));
	front.rotateY(Utils.degToRad(90));

	back.translateX(-1024);
	back.rotateX(Utils.degToRad(90));
	back.rotateY(Utils.degToRad(90));

	left.translateY(-1024);
	left.rotateZ(Utils.degToRad(180));
	left.rotateX(Utils.degToRad(90));

	right.translateY(1024);
	right.rotateX(Utils.degToRad(90));

	top.translateZ(1024);
	top.rotateZ(Utils.degToRad(180));

	this.addChild(front);
	this.addChild(left);
	this.addChild(back);
	this.addChild(top);
	this.addChild(right);

}

Fondo.prototype = Object.create(ComplexModel.prototype);

Fondo.prototype.constructor = Fondo;
