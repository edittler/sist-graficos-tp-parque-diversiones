/*
 * Vias
 */
function Vias(path) {
	ComplexModel.call(this);

	var path2 = path.slice();
	for (var c = 0; c < path2.length; c++) {
		path2[c] = [ path2[c][0] * 1.5, path2[c][1] * 1.1, path2[c][2] ];
	}

	var path1 = path.slice();
	for (var c = 0; c < path1.length; c++) {
		path1[c] = [ path1[c][0] * 0.7, path1[c][1] * 1, path1[c][2] ];
	}

	var via1 = new Via(path1 ,1, Color.GREY);
	via1.translate(-100, -60, 50);

	var via2 = new Via(path2, 1, Color.ORANGE);
	via2.translate(-100, -60, 50);

	var via3 = new Via(path, 0.5, Color.GREY);
	//via3.translate(-95, -65, 47);

	// this.addChild(via1);
	// this.addChild(via2);
	this.addChild(via3);

}

Vias.prototype = Object.create(ComplexModel.prototype);
Vias.prototype.constructor = Vias;
