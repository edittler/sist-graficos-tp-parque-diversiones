// OBJETO VERTEX-GRID
// Definimos un constructor para el objeto VertexGrid
var VertexGrid = function (rows, cols) {
	this.cols = cols;
	this.rows = rows;
	this.index_buffer = null;

	this.position_buffer = null;
	this.color_buffer = null;

	this.webgl_position_buffer = null;
	this.webgl_color_buffer = null;
	this.webgl_index_buffer = null;
};


VertexGrid.prototype.createIndexBuffer = function () {
	// ACTIVIDAD 1.
	// Este index buffer está armado para renderizar dos los triangulos
	// que se obervan como ejemplo.
	// Modificar el método para que a partir de conocer las dimensiones
	// de la grilla (que deberían estar en los atributos this.rows y this.cols)
	// se genere el index buffer correspondiente para renderizar la grilla utilizando
	// triangle-strip
	//

	// Number of vertexes needed for grid
	var RCvertices = 2 * this.cols * (this.rows - 1),
		// Number of vertexes needed for triangle strip
		TSvertices = 2 * this.cols * (this.rows - 1) + 2 * (this.rows - 2),
		j = 0, // Index for triangle strip array
		trianglestrip = [];
	for (var i = 1; i <= RCvertices; i += 2) { // Loop through grid array
		trianglestrip[j] = (1 + i) / 2 - 1; // ODD numbers
		trianglestrip[j + 1] = (this.cols * 2 + i + 1) / 2 - 1; // EVEN numbers
		if (trianglestrip[j + 1] % this.cols === 0) { // Check for end of column
			// Skip first row and last row
			if (trianglestrip[j + 1] !== this.cols && trianglestrip[j + 1] !== this.cols * this.rows) {
				// Additional vertex degenerate triangle
				trianglestrip[j + 2] = trianglestrip[j + 1];
				// Additional vertex degenerate triangle
				trianglestrip[j + 3] = (1 + i + 2) / 2;
				j += 2; // Increment index
			}
		}
		j += 2; // Increment index
	}
	this.index_buffer = trianglestrip;
	//this.index_buffer = [0, 1, 2, 3];
};


// Esta función inicializa el position_buffer y el color buffer de forma de
// crear un plano de color gris que se extiende sobre el plano XY, con Z=0
// El plano se genera centrado en el origen.
// El propósito de esta función es a modo de ejemplo de como inicializar y
// cargar los buffers de las posiciones y el color para cada vértice.
VertexGrid.prototype.createUniformPlaneGrid = function () {
	this.position_buffer = [];
	this.color_buffer = [];

	for (var i = 0; i < this.rows; i++) {
		for (var j = 0; j < this.cols; j++) {
			// Para cada vértice definimos su posición
			// como coordenada (x, y, z=0)
			this.position_buffer.push(i - (this.rows - 1.0) / 2.0);
			this.position_buffer.push(j - (this.rows - 1) / 2.0);
			this.position_buffer.push(0);

			// Para cada vértice definimos su color
			this.color_buffer.push(1.0 / this.rows * i);
			this.color_buffer.push(0.4);
			this.color_buffer.push(1.0 / this.cols * j);
		}
	}
};


// ACTIVIDAD 2.
// Crear alguna otra función similar a la anterior createUniformPlaneGrid()
// que cree una superficie en donde la altura ya no sea z=0 sino que tenga aluna forma
// o partón en particular.

// Esta función inicializa el position_buffer y el color buffer de forma de
// crear un plano de color gris que se extiende sobre el plano XY, con Z=0
// El plano se genera centrado en el origen.
// El propósito de esta función es a modo de ejemplo de como inicializar y cargar
// los buffers de las posiciones y el color para cada vértice.
VertexGrid.prototype.createTerrainPlaneGrid = function () {
	this.position_buffer = [];
	this.color_buffer = [];

	for (var i = 0.0; i < this.rows; i++) {
		for (var j = 0.0; j < this.cols; j++) {
			// Para cada vértice definimos su posición
			// como coordenada (x, y, z=0)
			this.position_buffer.push(i - (this.rows - 1.0) / 2.0);
			this.position_buffer.push(j - (this.rows - 1) / 2.0);
			var max = 4.0;
			var min = -2.0;
			var random = Math.random() * (max - min) + min;
			var noise = PerlinNoise.noise(this.position_buffer[0],
				this.position_buffer[1],
				random);

			this.position_buffer.push(noise);

			// Para cada vértice definimos su color
			this.color_buffer.push(0.5 / this.rows * i);
			this.color_buffer.push(0.5 / noise);
			this.color_buffer.push(0.5 / this.cols * j);
		}
	}
};


// Esta función crea e incializa los buffers dentro del pipeline para luego
// utlizarlos a la hora de renderizar.
VertexGrid.prototype.setupWebGLBuffers = function () {
	// 1. Creamos un buffer para las posicioens dentro del pipeline.
	this.webgl_position_buffer = gl.createBuffer();
	// 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
	// hemos creado.
	gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
	// 3. Cargamos datos de las posiciones en el buffer.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);

	// Repetimos los pasos 1. 2. y 3. para la información del color
	this.webgl_color_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);

	// Repetimos los pasos 1. 2. y 3. para la información de los índices
	// Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
	// Notar también que se usa un array de enteros en lugar de floats.
	this.webgl_index_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
};


// Esta función es la que se encarga de configurar todo lo necesario
// para dibujar el VertexGrid.
// En el caso del ejemplo puede observarse que la última línea del método
// indica dibujar triángulos utilizando los 6 índices cargados en el Index_Buffer.
//
// ACTIVIDAD 3.
// Reemplazar dicha línea de código por la correspondiente para dibujar el strip
// de triángulos utilizando el index buffer generado en la ACTIVIDAD 1.
VertexGrid.prototype.drawVertexGrid = function () {
	var vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	var vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
	gl.enableVertexAttribArray(vertexColorAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
	gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

	// Dibujamos.
	gl.drawElements(gl.TRIANGLE_STRIP, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
};


// This is a port of Ken Perlin's Java code. The
// original Java code is at http://cs.nyu.edu/%7Eperlin/noise/.
// Note that in this version, a number from 0 to 1 is returned.
PerlinNoise = new function () {
	this.noise = function (x, y, z) {
		var p = new Array(512);
		var permutation = [151, 160, 137, 91, 90, 15,
					   131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
					   190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
					   88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
					   77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
					   102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
					   135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
					   5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
					   223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
					   129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
					   251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
					   49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
					   138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
					  ];
		for (var i = 0; i < 256; i++) {
			p[256 + i] = p[i] = permutation[i];
		}

		var X = Math.floor(x) & 255, // FIND UNIT CUBE THAT
			Y = Math.floor(y) & 255, // CONTAINS POINT.
			Z = Math.floor(z) & 255;
		x -= Math.floor(x); // FIND RELATIVE X,Y,Z
		y -= Math.floor(y); // OF POINT IN CUBE.
		z -= Math.floor(z);
		var u = fade(x), // COMPUTE FADE CURVES
			v = fade(y), // FOR EACH OF X,Y,Z.
			w = fade(z);
		var A = p[X] + Y,
			AA = p[A] + Z,
			AB = p[A + 1] + Z, // HASH COORDINATES OF
			B = p[X + 1] + Y,
			BA = p[B] + Z,
			BB = p[B + 1] + Z; // THE 8 CUBE CORNERS,

		return scale(lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), // AND ADD
					grad(p[BA], x - 1, y, z)), // BLENDED
				lerp(u, grad(p[AB], x, y - 1, z), // RESULTS
					grad(p[BB], x - 1, y - 1, z))), // FROM  8
			lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), // CORNERS
					grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
				lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
					grad(p[BB + 1], x - 1, y - 1, z - 1)))));
	};

	function fade(t) {
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	function lerp(t, a, b) {
		return a + t * (b - a);
	}

	function grad(hash, x, y, z) {
		var h = hash & 15; // CONVERT LO 4 BITS OF HASH CODE
		var u = h < 8 ? x : y, // INTO 12 GRADIENT DIRECTIONS.
			v = h < 4 ? y : h == 12 || h == 14 ? x : z;
		return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
	}

	function scale(n) {
		return (1 + n) / 2;
	}
};