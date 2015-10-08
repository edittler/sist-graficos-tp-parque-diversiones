/*
 *  Buffer para guardar datos sobre indices y poder pintarlos
 */
function IndexBuffer(gl) {
	Buffer.call(this, gl, gl.ELEMENT_ARRAY_BUFFER);
}

IndexBuffer.prototype = Object.create(Buffer.prototype);

IndexBuffer.prototype.constructor = IndexBuffer;

// @override
IndexBuffer.prototype.setData = function (data) {
	Buffer.prototype.setData.call(this, 1, new Uint16Array(data));
};

IndexBuffer.prototype.draw = function (mode) {
	this.bind();
	this.glContext.drawElements(mode, this.numItems, this.glContext.UNSIGNED_SHORT, 0);
};