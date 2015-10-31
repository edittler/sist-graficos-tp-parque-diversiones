/*
 * Base Sillas voladoras
 */
function Base() {
    PrimitiveModel.prototype.constructor.call(this);

    var torre = new Path(10);
    torre.addStretch(new LinearCurve([
        [15,0], [15,30], [10,40], [10,40], [8.7,55], [8.7,85],
    ]));

    var geometry = new RevolutionSurface(torre, 30);
    geometry.setClosedEndings(false);
    geometry.setCenteredInKernel(false);

    var material = new ColoredMaterial(Color.RED);

    this.init(geometry, material);
}

Base.prototype = Object.create(PrimitiveModel.prototype);

Base.prototype.constructor = Base;
