/*
 * Sillas voladoras
 */
function SillasVoladoras() {
    PrimitiveModel.prototype.constructor.call(this);

        var torre = new Path(10);
        torre.addStretch(new LinearCurve([
            [2,0], [2,2], [1,3], [1,5]
        ]));
        torre.addStretch(new QuadraticBezier([
            [1,5], [3.2,5], [3.6,5.7], [3,6], [3,6.5], [3.6,6.8],
            [3.2,7.4], [2.7,7.8], [1,8.2], [0,8.2]
        ]));

        var geometry = new RevolutionSurface(torre, 30);
        geometry.setClosedEndings(false);
        geometry.setCenteredInKernel(false);

        var material = new ColoredMaterial(Color.RED);

        this.init(geometry, material);
}

SillasVoladoras.prototype = Object.create(PrimitiveModel.prototype);

SillasVoladoras.prototype.constructor = SillasVoladoras;
