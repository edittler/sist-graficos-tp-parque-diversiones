/*
 *  Encapsula un buffer de Opengl
 */
function Buffer(gl, target) {
	this.glContext = gl;
	this.data; // datos que guarda el buffer
	this.glBuffer = gl.createBuffer(); // referencia al buffer
	this.target = target; // tipo de buffer
	this.itemSize; // tamaño de los items del buffer
	this.numItems; // cantidad de items en el buffer
}

Buffer.prototype.bind = function () {
	this.glContext.bindBuffer(this.target, this.glBuffer);
};

Buffer.prototype.setData = function (size, data) {
	this.bind();
	this.glContext.bufferData(this.target, data, this.glContext.STATIC_DRAW);
	this.data = data;
	this.itemSize = size;
	this.numItems = data.length / size;
};

Buffer.prototype.getData = function () {
	return this.data;
};
