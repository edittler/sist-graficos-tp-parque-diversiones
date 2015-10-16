/*
 * Buffer para guardar datos sobre atributos
 */
function AttributeBuffer(gl) {
	Buffer.call(this, gl, gl.ARRAY_BUFFER);
}

AttributeBuffer.prototype = Object.create(Buffer.prototype);

AttributeBuffer.prototype.constructor = AttributeBuffer;

// @override
AttributeBuffer.prototype.setData = function (size, data) {
	Buffer.prototype.setData.call(this, size, new Float32Array(data));
};

AttributeBuffer.prototype.associateAttrPointer = function (vertexAttr) {
	if (vertexAttr >= 0) {
		var gl = this.glContext;
		this.bind();
		gl.vertexAttribPointer(vertexAttr, this.itemSize, gl.FLOAT, false, 0, 0);
	}
};
