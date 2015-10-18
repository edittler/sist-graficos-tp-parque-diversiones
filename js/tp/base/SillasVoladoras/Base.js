/*
 * Base Sillas voladoras
 */
function Base() {
    PrimitiveModel.prototype.constructor.call(this);

    var torre = new Path(10);
    torre.addStretch(new LinearCurve([
        [1.5,0], [1.5,3], [1,4], [1,4], [0.87,5.5], [0.87,8.5], 
    ]));

    var geometry = new RevolutionSurface(torre, 30);
    geometry.setClosedEndings(false);
    geometry.setCenteredInKernel(false);

    var material = new ColoredMaterial(Color.RED);

    this.init(geometry, material);
}

Base.prototype = Object.create(PrimitiveModel.prototype);

Base.prototype.constructor = Base;