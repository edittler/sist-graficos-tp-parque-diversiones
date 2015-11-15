/*
 * Textura formada por 6 imágenes para simular reflexión
 */
function CubeMap(imgSrcs) {
	this.glTexture;

	this.imgSrcs = imgSrcs; // nombres de las 6 imágenes que forman el cubo
}

CubeMap.prototype.init = function (gl) {
	var glTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

	var ct = 0;
	var img = new Array(6);

	for (var i = 0; i < 6; i++) {
		img[i] = new Image();
		img[i].src = this.imgSrcs[i];
		img[i].onload = function () {
			ct++;
			if (ct == 6) {
				var targets = [
					gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
					gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
					gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
				];
				for (var j = 0; j < 6; j++) {
					gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				}
				gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			}
		}; // jshint ignore:line
	}

	this.glTexture = glTexture;
};

CubeMap.prototype.bind = function (gl, id) {
	gl.activeTexture(id);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.glTexture);
};
