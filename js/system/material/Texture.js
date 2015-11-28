/*
 * Textura extraída de una imagen
 */
function Texture(imgSrc) {
	this.glTexture;

	this.imageSrc = imgSrc; // nombre de la imagen de la que se extrae la textura
}

Texture.prototype.init = function (gl, repeat) {
	var handleLoadedTexture = function (gl, texture, repeat) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

		// Check if the image is a power of 2 in both dimensions.
		if (Utils.isPowerOf2(texture.image.width) && Utils.isPowerOf2(texture.image.height)) {
			// Yes, it's a power of 2. Generate mips.
			gl.generateMipmap(gl.TEXTURE_2D);
			if (!repeat[0]) { // u
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			}
			if (!repeat[1]) { // v
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
	};

	var glTexture = gl.createTexture();
	glTexture.image = new Image();
	glTexture.image.onload = function () {
		handleLoadedTexture(gl, glTexture, repeat);
	};
	glTexture.image.src = this.imageSrc;

	this.glTexture = glTexture;
};

Texture.prototype.bind = function (gl, id) {
	gl.activeTexture(id);
	gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
};
