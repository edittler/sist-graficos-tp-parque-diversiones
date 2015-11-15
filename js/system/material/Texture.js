/*
 * Textura extraída de una imagen
 */
function Texture(imgSrc) {
	this.glTexture;

	this.imageSrc = imgSrc; // nombre de la imagen de la que se extrae la textura
}

// Métodos públicos
Texture.prototype.init = function (gl, repeat) {
	var handleLoadedTexture = function (gl, texture, repeat) {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		if (!repeat[0]) { // u
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		}
		if (!repeat[1]) { // v
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		gl.generateMipmap(gl.TEXTURE_2D);

		gl.bindTexture(gl.TEXTURE_2D, null);
	};

	var glTexture = gl.createTexture();
	glTexture.image = new Image();
	glTexture.image.src = this.imageSrc;
	glTexture.image.onload = function () {
		handleLoadedTexture.call(this, gl, glTexture, repeat);
	};

	this.glTexture = glTexture;
};

Texture.prototype.bind = function (gl, id) {
	gl.activeTexture(id);
	gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
};