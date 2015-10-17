/*
 * Prisma
 */
function Prism(radius1, radius2, height, faces, material) {
	PrimitiveModel.call(this);

	var side = new Path(2);
	side.addStretch(new LinearCurve([[radius1, 0], [radius2, height]]));

	this.geometry = new RevolutionSurface(side, faces);
	this.material = material;
}

Prism.prototype = Object.create(PrimitiveModel.prototype);

Prism.prototype.constructor = Prism;

// @override
Prism.prototype.prepareToRender = function (gl) {
	this.init(this.geometry, this.material);
	PrimitiveModel.prototype.prepareToRender.call(this, gl);
};