/*
	Controlador estático para el teclado
*/
var Keyboard = {
    _pressed: {},  // teclas apretadas en este momento

    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    N0: 48,
    N1: 49,
    N2: 50,
    N3: 51,
    N4: 52,
    N5: 53,
    N6: 54,
    N7: 55,
    N8: 56,
    N9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
  
    isKeyPressed: function(keyCode, singleInput) {
        var pressed = this._pressed[keyCode];
        if(Utils.isDefined(singleInput) && singleInput) {
            delete this._pressed[keyCode];
        }
        return pressed;
    },

    //*********************************************
    
    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
};

window.addEventListener('keyup', function(event) { Keyboard.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Keyboard.onKeydown(event); }, false);

/*
Sacada idea de acá:
http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
*/
/*
 * Controlador estático para el mouse
 */
var Mouse = {
	_x: 0,
	_y: 0,

	_deltaX: 0,
	_deltaY: 0,

	_wheelDelta: 0,

	_pressed: {}, // botones apretadas en este momento

	LEFT: 1,
	MIDDLE: 2,
	RIGHT: 3,

	isButtonPressed: function (button) {
		return Mouse._pressed[button];
	},

	getPosition: function () {
		return [Mouse._x, Mouse._y];
	},

	getX: function () {
		return Mouse._x;
	},

	getY: function () {
		return Mouse._y;
	},

	isMoving: function () {
		return Mouse._deltaX !== 0 || Mouse._deltaY !== 0;
	},

	getDeltaX: function () {
		var delta = Mouse._deltaX;
		Mouse._deltaX = 0;
		return delta;
	},

	getDeltaY: function () {
		var delta = Mouse._deltaY;
		Mouse._deltaY = 0;
		return delta;
	},

	isWheelMoving: function () {
		return Mouse._wheelDelta !== 0;
	},

	getWheelDelta: function () {
		var delta = Mouse._wheelDelta;
		Mouse._wheelDelta = 0;
		return delta;
	},

	//*********************************************

	onmousedown: function (event) {
		Mouse._deltaX = 0;
		Mouse._deltaY = 0;
		event = event || window.event;
		var button = event.which || event.button;
		Mouse._pressed[button] = true;
	},

	onmouseup: function (event) {
		event = event || window.event;
		var button = event.which || event.button;
		delete Mouse._pressed[button];
	},

	onmousemove: function (event) {
		Mouse._deltaX = event.clientX - Mouse._x;
		Mouse._deltaY = event.clientY - Mouse._y;
		Mouse._x = event.clientX;
		Mouse._y = event.clientY;
	},

	onMouseWheel: function (event) {
		Mouse._wheelDelta = 0;
		if (!event) { /* For IE. */
			event = window.event;
		}
		if (event.wheelDelta) { /* IE/Opera. */
			Mouse._wheelDelta = event.wheelDelta / 120;
		} else if (event.detail) { /** Mozilla case. */
			/** In Mozilla, sign of delta is different than in IE.
			 * Also, delta is multiple of 3.
			 */
			Mouse._wheelDelta = -event.detail / 3;
		}
		/** Prevent default actions caused by mouse wheel.
		 * That might be ugly, but we handle scrolls somehow
		 * anyway, so don't bother here..
		 */
		if (event.preventDefault) {
			event.preventDefault();
		}

		event.returnValue = false;
	}
};

document.onmousedown = Mouse.onmousedown;
document.onmouseup = Mouse.onmouseup;
document.onmousemove = Mouse.onmousemove;

// inicializar event listener para rueda del mouse
if (window.addEventListener) { // firefox
	window.addEventListener('DOMMouseScroll', Mouse.onMouseWheel, false);
}
// ie, opera
window.onmousewheel = document.onmousewheel = Mouse.onMouseWheel;
/*
 * Encapsula todo el tratamiento del contexto gl y el canvas
 */
function Renderer(w, h) {
	this.canvas;
	this.gl;

	this.initCanvas(w, h);
	this.initWebGL();
}

Renderer.prototype.initCanvas = function (w, h) {
	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	canvas.style.backgroundColor = "black";

	this.canvas = canvas;
};

Renderer.prototype.initWebGL = function () {
	var gl = null;
	var ops = {
		preserveDrawingBuffer: true
	};

	try {
		// Intentamos primero con el contexto estandar. Si falla, probamos
		// con el experimental.
		gl = this.canvas.getContext("webgl", ops) ||
			this.canvas.getContext("experimental-webgl", ops);
	} catch (e) {}

	// Si no tenemos un contexto, abortamos.
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		gl = null;
	}

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, this.canvas.width, this.canvas.height);

	this.gl = gl;
};

Renderer.prototype.getCanvasElement = function () {
	return this.canvas;
};

Renderer.prototype.getWidth = function () {
	return this.canvas.width;
};

Renderer.prototype.getHeight = function () {
	return this.canvas.height;
};

Renderer.prototype.setClearColor = function (r, g, b, alpha) {
	// color de fondo para la escena
	this.gl.clearColor(r, g, b, alpha);
};

Renderer.prototype.clear = function () {
	// Se limpia la pantalla
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
};

Renderer.prototype.render = function (scene, camera) {
	scene.draw(this.gl, camera);
};

/*
 * Contiene e inicializa modelos para luego dibujarlos
 */
function Scene() {
	Transformable.call(this);
	this.models = []; // modelos en la escena
	this.auto;

	//TODO: poner esto en una clase tipo Light cuando se tenga un
	// shader capaz de agregar más de una fuente de luz
	this.hasLight = false; // si es false usa iluminacion por defecto
	this.ambientIntensity;
	this.directionalIntensity;
	this.lightPosition;

	this.carLightColor;
	this.carLightPosition;
	this.carLightDirection;
}

Scene.prototype = Object.create(Transformable.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.prepareModels = function (gl) {
	var models = this.models;
	for (var i = 0; i < models.length; i++) {
		if (!models[i].isInitialized()) {
			models[i].prepareToRender(gl);
		}
	}
};

Scene.prototype.setLightSources = function (amb, dir, pos, carLightColor, carLightPosition, carLightDirection) {
	this.hasLight = true;

	this.ambientIntensity = amb;
	this.directionalIntensity = dir;
	this.lightPosition = vec3.fromValues(pos[0], pos[1], pos[2]);

	this.carLightColor = carLightColor;
	this.carLightPosition = vec3.fromValues(carLightPosition[0], carLightPosition[1], carLightPosition[2]);
	this.carLightDirection = vec3.fromValues(carLightDirection[0], carLightDirection[1], carLightDirection[2]);
};

Scene.prototype.add = function (model) {
	// Agrega un modelo a la escena
	this.models.push(model);
};

Scene.prototype.draw = function (gl, camera) {
	// Prepara los modelos para dibujarlos
	this.prepareModels(gl);

	var models = this.models;
	var mMatrix = this.objectMatrix;
	var vMatrix = camera.getViewMatrix();
	var pMatrix = camera.getProjectionMatrix();

	var carMatrix;
	if (this.auto) {
		carMatrix = this.auto.getObjectMatrix();
	} else {
		carMatrix = mat4.create();
	}

	var pos = camera.getAlignedWithCamera(this.lightPosition);
	vec3.transformMat4(pos, pos, mMatrix);

	var transformedCarLight = vec3.create();
	vec3.transformMat4(transformedCarLight, this.carLightPosition, carMatrix);
	transformedCarLight = camera.getAlignedWithCamera(transformedCarLight);
	vec3.transformMat4(transformedCarLight, transformedCarLight, mMatrix);

	var transformedCarLightDirection = vec3.create();

	// direction = pos2 - this.carLightPosition
	// pos2 = direction + this.carLightPostion
	var pos2 = vec3.create();
	vec3.add(pos2, this.carLightPosition, this.carLightDirection);
	vec3.transformMat4(pos2, pos2, carMatrix);
	pos2 = camera.getAlignedWithCamera(pos2);
	vec3.transformMat4(pos2, pos2, mMatrix);

	vec3.subtract(transformedCarLightDirection, pos2, transformedCarLight);
	vec3.normalize(transformedCarLightDirection, transformedCarLightDirection);

	var ambient, directional;
	if (this.hasLight) {
		ambient = this.ambientIntensity;
		directional = this.directionalIntensity;
	}

	for (var i = 0; i < models.length; i++) {
		if (this.hasLight) {
			models[i].setLights(gl, ambient, directional, pos, this.carLightColor, transformedCarLight, transformedCarLightDirection);
		}
		models[i].setRenderMatrixes(mMatrix, vMatrix, pMatrix);
		models[i].draw(gl);
	}
};

Scene.prototype.update = function (elapsedTime) {
	var models = this.models;

	for (var i = 0; i < models.length; i++) {
		models[i].callUpdate(models[i], elapsedTime);
	}
};

Scene.prototype.setAuto = function (auto) {
	this.auto = auto;
};

/*
 * Objeto transformable en el espacio
 */
function Transformable() {
	this.objectMatrix = mat4.create(); // matriz de transformaciones al objeto
	this.resetTransformations();
}

Transformable.prototype.translate = function (x, y, z) {
	var m = mat4.create();
	mat4.translate(m, m, [x, y, z]);
	this.applyTransformationMatrix(m, false);
};

Transformable.prototype.translateX = function (x) {
	this.translate(x, 0, 0);
};

Transformable.prototype.translateY = function (y) {
	this.translate(0, y, 0);
};

Transformable.prototype.translateZ = function (z) {
	this.translate(0, 0, z);
};

Transformable.prototype.rotate = function (rad, axis) {
	var m = mat4.create();
	mat4.rotate(m, m, rad, axis);
	this.applyTransformationMatrix(m, false);
};

Transformable.prototype.rotateX = function (rad) {
	this.rotate(rad, [1, 0, 0]);
};

Transformable.prototype.rotateY = function (rad) {
	this.rotate(rad, [0, 1, 0]);
};

Transformable.prototype.rotateZ = function (rad) {
	this.rotate(rad, [0, 0, 1]);
};

Transformable.prototype.setPosition = function (x, y, z) {
	this.resetTransformations();
	this.translate(x, y, z);
};

Transformable.prototype.scale = function (factor) {
	var m = mat4.create();
	mat4.scale(m, m, [factor, factor, factor]);
	this.applyTransformationMatrix(m, false);
};

Transformable.prototype.scaleNonUniform = function (x, y, z) {
	var m = mat4.create();
	mat4.scale(m, m, [x, y, z]);
	this.applyTransformationMatrix(m, false);
};

Transformable.prototype.applyTransformationMatrix = function (matrix, reset) {
	// Por defecto resetea transformaciones anteriores
	if (!Utils.isDefined(reset) || reset === true) {
		this.resetTransformations();
	}
	// Siempre multiplica a izquierda
	mat4.multiply(this.objectMatrix, this.objectMatrix, matrix);
};

Transformable.prototype.resetTransformations = function () {
	mat4.identity(this.objectMatrix);
};

Transformable.prototype.getObjectMatrix = function () {
	return this.objectMatrix;
};

Transformable.prototype.getPosition = function () {
	// Obtiene la posicion a partir de la matriz de transformaciones
	var v = vec3.create();
	var inverse = mat4.create();
	mat4.invert(inverse, this.objectMatrix);
	vec3.transformMat4(v, v, inverse);
	vec3.negate(v, v);
	return v;
};

/**
 * Clase de utilidades con métodos estáticos
 */

function Utils() {}

// Métodos estáticos

Utils.isDefined = function (val) {
	return typeof val !== 'undefined' && val !== null;
};

Utils.randomBetween = function (a, b) {
	return a + Math.floor((Math.random() * b) + 1);
};

/**
 * Verifica si el valor es potencia de 2.
 *
 * @param {Number} value valor numero a verificar
 * @returns {bool} true si el número es potencia de 2
 */
Utils.isPowerOf2 = function (value) {
	return (value & (value - 1)) === 0;
};

Utils.degToRad = function (rad) {
	return rad * (Math.PI / 180);
};

/**
 * Calcula el ángulo entre 2 vectores de 3 dimensiones
 *
 * @param {vec3} a vector de 3 dimensiones
 * @param {vec3} b vector de 3 dimensiones
 * @returns {Number} angulo entre los 2 vectores
 */
Utils.angleBetweenVectors = function (a, b) {
	var normalizedA = vec3.create();
	vec3.normalize(normalizedA, a);

	var normalizedB = vec3.create();
	vec3.normalize(normalizedB, b);

	var dotProduct = vec3.dot(normalizedA, normalizedB);
	var angle = Math.acos(dotProduct);
	return angle;
};

/*
 * Curva tipo BSpline
 */
function BSplineCurve(ctrlPoints, basis) {
	Curve.call(this, ctrlPoints, basis);
}

BSplineCurve.prototype = Object.create(Curve.prototype);
BSplineCurve.prototype.constructor = BSplineCurve;

BSplineCurve.prototype.pointAt = function (u, stretch) {
	var basis = this.basis;
	var ctrlPoints = this.ctrlPoints;

	var startPoint = stretch + basis.length > ctrlPoints.length ? stretch - 1 : stretch;
	var deltaU = u - stretch;

	var point = [];

	for (var c = 0; c < 3; c++) {
		point[c] = 0;
		for (var p = 0; p < basis.length; p++) {
			point[c] += basis[p](deltaU) * ctrlPoints[startPoint + p][c];
		}
	}

	return point;
};

BSplineCurve.prototype.getPoints = function (definition) {
	var points = [];
	var deltaU = 1 / definition;
	var stretch = 0;

	for (var u = 0; u <= this.numbStretchs + deltaU; u += deltaU) {
		var point = this.pointAt(u, stretch);
		points = points.concat([point]);

		if (Math.floor(u) > stretch) {
			stretch++;
		}
	}

	return points;
};

BSplineCurve.prototype.derivativePointAt = function (u, stretch) {
	var basis = this.derivativeBasis;
	var ctrlPoints = this.ctrlPoints;

	var startPoint = stretch + basis.length > ctrlPoints.length ? stretch - 1 : stretch;
	var deltaU = u - stretch;

	var point = [];

	for (var c = 0; c < 3; c++) {
		point[c] = 0;
		for (var p = 0; p < basis.length; p++) {
			point[c] += basis[p](deltaU) * ctrlPoints[startPoint + p][c];
		}
	}

	return point;
};

BSplineCurve.prototype.getDerivativePoints = function (definition) {
	var points = [];
	var deltaU = 1 / definition;
	var stretch = 0;

	for (var u = 0; u <= this.numbStretchs + deltaU; u += deltaU) {
		var point = this.derivativePointAt(u, stretch);
		points = points.concat([point]);

		if (Math.floor(u) > stretch) {
			stretch++;
		}
	}

	return points;
};

/*
 * Curva tipo Bezier
 */
function BezierCurve(ctrlPoints, basis) { // jshint ignore:line
	Curve.call(this, ctrlPoints, this.basis);
	this.continuousPoints = []; // puntos para que los tramos queden continuos
}

BezierCurve.prototype = Object.create(Curve.prototype);
BezierCurve.prototype.constructor = BezierCurve;

BezierCurve.prototype.pointAt = function (u) {
	var basis = this.basis;
	var ctrlPoints = this.continuousPoints;

	if (ctrlPoints.length === 0) {
		ctrlPoints = this.ctrlPoints;
	}

	var stretch = Math.floor(u);
	var startPoint = stretch * (basis.length - 1);
	var deltaU = u - stretch;

	var point = [];

	for (var c = 0; c < 3; c++) {
		point[c] = 0;
		for (var p = 0; p < basis.length; p++) {
			point[c] += basis[p](deltaU) * ctrlPoints[startPoint + p][c];
		}
	}

	return point;
};

BezierCurve.prototype.setContinuousPoints = function (contPoints) {
	this.continuousPoints = contPoints;
};

BezierCurve.prototype.getPoints = function (definition) {
	var points = [];
	var deltaU = 1 / definition;

	for (var u = deltaU; u <= this.numbStretchs - deltaU; u += deltaU) {
		var point = this.pointAt(u);
		points = points.concat([point]);
	}

	points.unshift(this.ctrlPoints[0]);
	points.push(this.ctrlPoints[this.ctrlPoints.length - 1]);

	return points;
};

/*
 * Curva de BSpline cúbica
 */
function CubicBSpline(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return (1 - u) * (1 - u) * (1 - u) * 1 / 6;
	};
	this.basis[1] = function (u) {
		return (4 - 6 * u * u + 3 * u * u * u) * 1 / 6;
	};
	this.basis[2] = function (u) {
		return (1 + 3 * u + 3 * u * u - 3 * u * u * u) * 1 / 6;
	};
	this.basis[3] = function (u) {
		return u * u * u * 1 / 6;
	};

	this.derivativeBasis = [];
	this.derivativeBasis[0] = function (u) {
		return (1 - u) * (1 - u) * 1 / 2;
	};
	this.derivativeBasis[1] = function (u) {
		return (- 4 * u + 3 * u * u) * 1 / 2;
	};
	this.derivativeBasis[2] = function (u) {
		return (1 + 2 * u - 3 * u * u) * 1 / 2;
	};
	this.derivativeBasis[3] = function (u) {
		return u * u * 1 / 2;
	};

	BSplineCurve.call(this, ctrlPoints, this.basis);
}

CubicBSpline.prototype = Object.create(BSplineCurve.prototype);
CubicBSpline.prototype.constructor = CubicBSpline;

/*
 * Curva de Bezier cúbica
 */
function CubicBezier(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return (1 - u) * (1 - u) * (1 - u);
	};
	this.basis[1] = function (u) {
		return 3 * (1 - u) * (1 - u) * u;
	};
	this.basis[2] = function (u) {
		return 3 * (1 - u) * u * u;
	};
	this.basis[3] = function (u) {
		return u * u * u;
	};

	BezierCurve.call(this, ctrlPoints, this.basis);

	this.setControlPoints(ctrlPoints);
}

CubicBezier.prototype = Object.create(BezierCurve.prototype);
CubicBezier.prototype.constructor = CubicBezier;

CubicBezier.prototype.calculateContinuousPoints = function () {
	// TODO: averiguar como encontrar el punto de union
	// de los tramos de manera que queden C2 continuo
	// alert("Error: bezier cúbica no soporta más de 4 puntos de control");
};

// @Override
CubicBezier.prototype.setControlPoints = function (newCtrlPoints) {
	BezierCurve.prototype.setControlPoints.call(this, newCtrlPoints);

	this.numbStretchs = this.ctrlPoints.length/this.basis.length;

	if (this.numbStretchs > 1) {
		this.calculateContinuousPoints();
	}
};

/*
 * Clase base para las curvas. Se definen a partir de los
 * puntos de control y las bases.
 */

function Curve(ctrlPoints, basis) {
	this.ctrlPoints = ctrlPoints; // puntos de control originales

	this.basis = basis; // bases que definen los pesos de los puntos

	// cantidad de tramos
	this.numbStretchs = ctrlPoints.length - this.basis.length + 1;
}

Curve.prototype.setControlPoints = function (newCtrlPoints) {
	this.ctrlPoints = newCtrlPoints;
};

Curve.prototype.getControlPoints = function () {
	return this.ctrlPoints;
};

Curve.prototype.getPoints = function (definition) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
	return;
};

/*
 * Curva lineal. Son todas lineas rectas entre los puntos de control
 */
function LinearCurve(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return (1 - u);
	};
	this.basis[1] = function (u) {
		return u;
	};

	BezierCurve.call(this, ctrlPoints, this.basis);
}

LinearCurve.prototype = Object.create(BezierCurve.prototype);

LinearCurve.prototype.constructor = LinearCurve;

/*
 * Conjunto de tramos definidos por puntos de varias curvas.
 * Se le pueden aplicar transformaciones a todos los puntos.
 */
function Path(definition) {
	Transformable.call(this);
	this.curves = []; // curvas que forman el camino
	this.definition = definition; // medida de puntos intermedios generados

	if (!Utils.isDefined(definition)) {
		this.definition = 1;
	}
}

Path.prototype = Object.create(Transformable.prototype);

Path.prototype.constructor = Path;

Path.prototype.transform = function (point) {
	var vec = vec3.fromValues(point[0], point[1],
		Utils.isDefined(point[2]) && !isNaN(point[2]) ? point[2] : 0);
	vec3.transformMat4(vec, vec, this.objectMatrix);
	return vec;
};

Path.prototype.addStretch = function (curve) {
	// agrega un nuevo tramo al camino
	this.curves.push(curve);
};

Path.prototype.getControlPoints = function () {
	var points = [];

	for (var c = 0; c < this.curves.length; c++) {
		var curvePoints = this.curves[c].getControlPoints();
		for (var p = 0; p < curvePoints.length; p++) {
			points = points.concat(this.transform(curvePoints[p]));
		}
	}

	return points;
};

Path.prototype.getPoints = function () {
	var points = [];

	for (var c = 0; c < this.curves.length; c++) {
		var curvePoints = this.curves[c].getPoints(this.definition);
		for (var p = 0; p < curvePoints.length; p++) {
			points = points.concat(this.transform(curvePoints[p]));
		}
	}
	return points;
};

Path.prototype.getKernelPoint = function (pts) {
	var points = pts;

	if (!Utils.isDefined(points)) {
		points = this.getControlPoints();
	}

	var xKernel = 0;
	var yKernel = 0;
	var zKernel = 0;

	for (var p = 0; p < points.length; p++) {
		xKernel += points[p][0];
		yKernel += points[p][1];
		zKernel += points[p][2];
	}

	xKernel /= points.length;
	yKernel /= points.length;
	zKernel /= points.length;

	return [xKernel, yKernel, zKernel];
};

/*
 *   Curva de BSpline cuadrática
 */
function QuadraticBSpline(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return 0.5 * (1 - u) * (1 - u);
	};
	this.basis[1] = function (u) {
		return 0.5 + u * (1 - u);
	};
	this.basis[2] = function (u) {
		return 0.5 * u * u;
	};

	BSplineCurve.call(this, ctrlPoints, this.basis);
}

QuadraticBSpline.prototype = Object.create(BSplineCurve.prototype);
QuadraticBSpline.prototype.constructor = QuadraticBSpline;

/*
 * Curva de Bezier cuadrática. Se obtienen puntos de control calculados 
 * para que curvas con más de 1 tramo (grado+1 < cant. puntos) se 
 * dibujen en forma continua.
 */
function QuadraticBezier(ctrlPoints) {
	this.basis = [];
	this.basis[0] = function (u) {
		return (1 - u) * (1 - u);
	};
	this.basis[1] = function (u) {
		return 2 * u * (1 - u);
	};
	this.basis[2] = function (u) {
		return u * u;
	};

	BezierCurve.call(this, ctrlPoints, this.basis);

	this.setControlPoints(ctrlPoints);
}

QuadraticBezier.prototype = Object.create(BezierCurve.prototype);
QuadraticBezier.prototype.constructor = QuadraticBezier;

QuadraticBezier.prototype.calculateContinuousPoints = function () {
	var numbPoints = this.ctrlPoints.length;
	var continuous = [];

	continuous.push(this.ctrlPoints[0]);

	for (var p = 1; p < numbPoints - 2; p++) {
		var p1 = vec3.create();
		var p2 = vec3.create();
		var middle = vec3.create();

		vec3.copy(p1, this.ctrlPoints[p]);
		vec3.copy(p2, this.ctrlPoints[p + 1]);

		vec3.subtract(middle, p2, p1);
		vec3.scale(middle, middle, 0.5);
		vec3.add(middle, middle, p1);

		continuous.push(p1);
		continuous.push(middle);
	}

	continuous.push(this.ctrlPoints[numbPoints - 2]);
	continuous.push(this.ctrlPoints[numbPoints - 1]);

	this.setContinuousPoints(continuous);
};

// @Override
QuadraticBezier.prototype.setControlPoints = function (newCtrlPoints) {
	BezierCurve.prototype.setControlPoints.call(this, newCtrlPoints);

	if (this.numbStretchs > 1) {
		this.calculateContinuousPoints();
	}
};

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
/*
 * Obtiene el src GLSL y compila el shader
 */
function Shader(src, type) {
	this.type = type; // vertex o fragment
	this.src = src; // codigo fuente del shader
}

Shader.Type = Object.freeze({
	VERTEX: 0,
	FRAGMENT: 1
});


// Método estático
Shader.obtainSrcFromHtmlElement = function (id) {
	var shaderScript, currentChild;

	// Obtenemos el elemento <script> que contiene el código fuente del shader.
	shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	// Extraemos el contenido de texto del <script>.
	var src = "";
	currentChild = shaderScript.firstChild;
	while (currentChild) {
		if (currentChild.nodeType == currentChild.TEXT_NODE) {
			src += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}

	return src;
};

Shader.prototype.compile = function (gl) {
	var shader;

	// Creamos un shader WebGL según el tipo.
	if (this.type == Shader.Type.FRAGMENT) {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (this.type == Shader.Type.VERTEX) {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	// Le decimos a WebGL que vamos a usar el texto como fuente para el shader.
	gl.shaderSource(shader, this.src);

	// Compilamos el shader.
	gl.compileShader(shader);

	// Chequeamos y reportamos si hubo algún error.
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("An error occurred compiling the shaders: " +
			gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
};

/*
 * Programa de shaders compuesto de un vertex y un fragment shader
 */
function ShaderProgram(vertexSrc, fragmentSrc) {
	this.vertexShader;
	this.fragmentShader;

	this.program; // referencia al programa linkeado

	this.assocAttributes; // hashmap con los attributes localizados
	this.assocUniforms; // hashmap con los uniforms localizados

	this.setSource(vertexSrc, fragmentSrc);
}

ShaderProgram.prototype.link = function (gl) {
	// Obtenemos los shaders ya compilados
	var vertexShader = this.vertexShader.compile(gl);
	var fragmentShader = this.fragmentShader.compile(gl);

	// Creamos un programa de shaders de WebGL.
	var shaderProgram = gl.createProgram();

	// Asociamos cada shader compilado al programa.
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	// Linkeamos los shaders para generar el programa ejecutable.
	gl.linkProgram(shaderProgram);

	// Chequeamos y reportamos si hubo algún error.
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program: " +
			gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	this.program = shaderProgram;
};

ShaderProgram.prototype.init = function (gl) {
	this.assocAttributes = [];
	this.assocUniforms = [];

	this.link(gl);
};

ShaderProgram.prototype.setSource = function (vertexSrc, fragmentSrc) {
	if (Utils.isDefined(vertexSrc) && Utils.isDefined(fragmentSrc)) {
		this.vertexShader = new Shader(vertexSrc, Shader.Type.VERTEX);
		this.fragmentShader = new Shader(fragmentSrc, Shader.Type.FRAGMENT);
	}
};

ShaderProgram.prototype.useThisProgram = function (gl) {
	gl.useProgram(this.program);
};

ShaderProgram.prototype.locateAttribute = function (gl, attr) {
	var attrIdx = gl.getAttribLocation(this.program, attr);
	if (attrIdx >= 0) {
		gl.enableVertexAttribArray(attrIdx);
		this.assocAttributes[attr] = attrIdx;
	}
};

ShaderProgram.prototype.locateUniform = function (gl, unif) {
	var unifLoc = gl.getUniformLocation(this.program, unif);
	if (Utils.isDefined(unifLoc)) {
		this.assocUniforms[unif] = unifLoc;
	}
};

ShaderProgram.prototype.getAttribute = function (attr) {
	return this.assocAttributes[attr];
};

ShaderProgram.prototype.getUniform = function (unif) {
	return this.assocUniforms[unif];
};

ShaderProgram.prototype.associateAttribute = function (buffer, attr) {
	var attribute = this.assocAttributes[attr];
	if (Utils.isDefined(attribute)) {
		buffer.associateAttrPointer(attribute);
	}
};

/*
 * ShaderProgram básico con color sin iluminación
 */
function BasicColorSP() {
	ShaderProgram.call(this);

	var vs = Shader.obtainSrcFromHtmlElement("basico-vs");
	var fs = Shader.obtainSrcFromHtmlElement("basico-fs");

	this.setSource(vs, fs);
}

BasicColorSP.prototype = Object.create(ShaderProgram.prototype);
BasicColorSP.prototype.constructor = BasicColorSP;

// @override
BasicColorSP.prototype.init = function (gl) {
	ShaderProgram.prototype.init.call(this, gl);

	this.locateUniform(gl, "uPMatrix");
	this.locateUniform(gl, "uMVMatrix");

	this.locateAttribute(gl, "aVertexPosition");
	this.locateAttribute(gl, "aVertexColor");
};

/*
 * ShaderProgram con textura
 */
function BasicTextureSP() {
	ShaderProgram.call(this);

	var vs = Shader.obtainSrcFromHtmlElement("basicoTextura-vs");
	var fs = Shader.obtainSrcFromHtmlElement("basicoTextura-fs");

	this.setSource(vs, fs);
}

BasicTextureSP.prototype = Object.create(ShaderProgram.prototype);
BasicTextureSP.prototype.constructor = BasicTextureSP;

// @override
BasicTextureSP.prototype.init = function (gl) {
	ShaderProgram.prototype.init.call(this, gl);

	this.locateUniform(gl, "uPMatrix");
	this.locateUniform(gl, "uMVMatrix");

	this.locateAttribute(gl, "aVertexPosition");
	this.locateAttribute(gl, "aTextureCoord");

	this.locateUniform(gl, "uSampler");
};

/*
 * ShaderProgram con iluminación y color
 */
function LightAndColorSP() {
	ShaderProgram.call(this);

	var vs = Shader.obtainSrcFromHtmlElement("conIluminacion-vs");
	var fs = Shader.obtainSrcFromHtmlElement("conIluminacion-fs");

	this.setSource(vs, fs);
}

LightAndColorSP.prototype  = Object.create(ShaderProgram.prototype);
LightAndColorSP.prototype.constructor = LightAndColorSP;

// @override
LightAndColorSP.prototype.init = function (gl) {
	ShaderProgram.prototype.init.call(this, gl);

	this.locateUniform(gl, "uPMatrix");
	this.locateUniform(gl, "uMVMatrix");

	this.locateAttribute(gl, "aVertexPosition");
	this.locateAttribute(gl, "aVertexNormal");
	this.locateAttribute(gl, "aVertexTangent");
	this.locateAttribute(gl, "aVertexColor");

	this.locateUniform(gl, "uNMatrix");
	this.locateUniform(gl, "uUseLighting");
	this.locateUniform(gl, "uAmbientColor");
	this.locateUniform(gl, "uDirectionalColor");
	this.locateUniform(gl, "uLightPosition");

	this.locateUniform(gl, "uCarLightTransformedPosition");
	this.locateUniform(gl, "uCarLightTransformedDirection");
	this.locateUniform(gl, "uCarLightColor");
	this.locateUniform(gl, "uCameraPos");

	this.locateUniform(gl, "uShininess");
};

/*
 *  ShaderProgram con iluminación y textura
 */
function LightAndTextureSP() {
	ShaderProgram.call(this);

	var vs = Shader.obtainSrcFromHtmlElement("conIluminacionYTextura-vs");
	var fs = Shader.obtainSrcFromHtmlElement("conIluminacionYTextura-fs");

	this.setSource(vs, fs);
}

LightAndTextureSP.prototype = Object.create(ShaderProgram.prototype);
LightAndTextureSP.prototype.constructor = LightAndTextureSP;

// @override
LightAndTextureSP.prototype.init = function (gl) {
	ShaderProgram.prototype.init.call(this, gl);

	this.locateUniform(gl, "uPMatrix");
	this.locateUniform(gl, "uMVMatrix");
	this.locateUniform(gl, "uNMatrix");

	this.locateAttribute(gl, "aVertexPosition");
	this.locateAttribute(gl, "aVertexNormal");
	this.locateAttribute(gl, "aVertexTangent");
	this.locateAttribute(gl, "aTextureCoord");

	this.locateUniform(gl, "uSampler");
	this.locateUniform(gl, "uSamplerLightMap");
	this.locateUniform(gl, "uSamplerNormalMap");
	this.locateUniform(gl, "uReflectionMap");

	this.locateUniform(gl, "uAmbientColor");
	this.locateUniform(gl, "uDirectionalColor");
	this.locateUniform(gl, "uLightPosition");

	this.locateUniform(gl, "uCarLightColor");
	this.locateUniform(gl, "uCarLightTransformedPosition");
	this.locateUniform(gl, "uCarLightTransformedDirection");

	this.locateUniform(gl, "uShininess");
	this.locateUniform(gl, "uReflectionFactor");
	this.locateUniform(gl, "uUsingLightMap");
	this.locateUniform(gl, "uLightMapFactor");
	this.locateUniform(gl, "uUsingNormalMap");
	this.locateUniform(gl, "uUsingReflectionMap");
};

/*
 * Geometría base de vértices y tríangulos.
 */
function Geometry() {
	this.vertices = [];
	this.indexes = [];
	this.triangles = [];

	this.normals = [];
	this.tangents = [];

	this.type;

	this.levels = 0; // nro de vertices a lo largo
	this.faces = 0; // nro de vertices a lo ancho
}

Geometry.prototype.calculateIndexes = function (levels, faces) {
	if (levels === 0 || faces === 0) {
		console.error("Error: no se definieron las dimensiones de la geometria");
		return;
	}

	var indexes = [];

	for (var n = 1; n < levels; n++) {
		for (var c = 0; c < faces; c++) {
			var v1, v2;

			if (n % 2) {
				v1 = (n - 1) * faces + c;
				v2 = n * faces + c;
			} else {
				v1 = n * faces - (c + 1);
				v2 = (n + 1) * faces - (c + 1);
			}

			indexes = indexes.concat([v1, v2]);

			if (c == faces - 1) {
				indexes = indexes.concat(v2);
			}
		}
	}

	this.indexes = indexes;

	// Genero explicitamente los indices de los triangles strip
	for (var i = 0; i < (this.indexes.length) - 2; i++) {
		var triangle = vec3.fromValues(this.indexes[i],
			this.indexes[i + 1], this.indexes[i + 2]);
		this.triangles.push(triangle);
	}
};

Geometry.prototype.calculateNormals = function () {
	// Normales de cada triangulo en el mismo orden que aparecen
	var triangleNormals = [];

	// Normales de cada vertice, se inicializan en 0,0,0
	var vertexNormals = [];

	var i;

	for (i = 0; i < this.indexes.length; i++) {
		var zero = vec3.fromValues(0, 0, 0);
		vertexNormals.push(zero);
	}

	var normal;
	// Calcular normales de cada triangulo
	for (i = 0; i < this.triangles.length; i++) {
		// Obtengo las coordenadas de cada vertice del triangulo
		var indexV1 = this.triangles[i][0];
		var v1x = this.vertices[indexV1 * 3];
		var v1y = this.vertices[(indexV1 * 3) + 1];
		var v1z = this.vertices[(indexV1 * 3) + 2];
		var v1 = vec3.fromValues(v1x, v1y, v1z);

		var indexV2 = this.triangles[i][1];
		var v2x = this.vertices[indexV2 * 3];
		var v2y = this.vertices[(indexV2 * 3) + 1];
		var v2z = this.vertices[(indexV2 * 3) + 2];
		var v2 = vec3.fromValues(v2x, v2y, v2z);

		var indexV3 = this.triangles[i][2];
		var v3x = this.vertices[indexV3 * 3];
		var v3y = this.vertices[(indexV3 * 3) + 1];
		var v3z = this.vertices[(indexV3 * 3) + 2];
		var v3 = vec3.fromValues(v3x, v3y, v3z);

		var vector1 = vec3.create();
		var vector2 = vec3.create();
		normal = vec3.create();

		// Calculo la normal
		vec3.subtract(vector1, v2, v1);
		vec3.subtract(vector2, v3, v1);

		if (this.type == 1 || this.type == 2) {

			if (i % 2 === 0) {
				// triangulos contra reloj
				vec3.cross(normal, vector1, vector2);
			} else {
				// triangulos a favor del reloj
				vec3.cross(normal, vector2, vector1);
			}
		} else if (this.type === 0) {
			if (i % 2 === 0) {
				// triangulos contra reloj
				vec3.cross(normal, vector2, vector1);
			} else {
				// triangulos a favor del reloj
				vec3.cross(normal, vector1, vector2);
			}
		}

		vec3.normalize(normal, normal);

		triangleNormals.push(normal);

		// Acumulo normales de los vertices correspondientes
		vec3.add(vertexNormals[indexV1], vertexNormals[indexV1], normal);
		vec3.add(vertexNormals[indexV2], vertexNormals[indexV2], normal);
		vec3.add(vertexNormals[indexV3], vertexNormals[indexV3], normal);
	}

	if (this.type == 2) {
		for (i = 0; i < vertexNormals.length; i++) {
			normal = vertexNormals[i];

			vec3.normalize(normal, normal);
			if (normal[1] > 0) {
				this.normals.push(0);
				this.normals.push(1);
				this.normals.push(0);
			} else if (normal[1] === 0) {
				this.normals.push(normal[0]);
				this.normals.push(normal[1]);
				this.normals.push(normal[2]);
			} else {
				this.normals.push(0);
				this.normals.push(-1);
				this.normals.push(0);
			}
		}
	} else {
		// Normalizar normales de cada vertice
		for (i = 0; i < vertexNormals.length; i++) {
			normal = vertexNormals[i];

			vec3.normalize(normal, normal);

			this.normals.push(normal[0]);
			this.normals.push(normal[1]);
			this.normals.push(normal[2]);
		}
	}
};

Geometry.prototype.setVertices = function (vertices) {
	this.vertices = vertices;
};

Geometry.prototype.setIndexes = function (indexes) {
	this.indexes = indexes;
};

Geometry.prototype.setNormals = function (normals) {
	this.normals = normals;
};

Geometry.prototype.setTangents = function (tangents) {
	this.tangents = tangents;
};

Geometry.prototype.defineDimensions = function (levels, faces) {
	this.levels = levels;
	this.faces = faces;
};

Geometry.prototype.prepareGeometry = function () {
	// Este método será llamado en el momento de la
	// inicialización de la geometría
};

Geometry.prototype.getVertices = function () {
	return this.vertices;
};

Geometry.prototype.getIndexes = function () {
	if (this.indexes.length === 0) {
		this.calculateIndexes(this.levels, this.faces);
	}

	return this.indexes;
};

Geometry.prototype.getNormals = function () {
	if (this.normals.length === 0) {
		this.calculateNormals();
	}
	return this.normals;
};

Geometry.prototype.getTangents = function () {
	if (this.tangents.length === 0) {
		var n = this.normals;

		for (var i = 0; i < n.length; i += 3) {
			var normal = vec3.fromValues(n[i], n[i + 1], n[i + 2]);
			var tangent = vec3.create();

			var c1 = vec3.create();
			var c2 = vec3.create();

			vec3.cross(c1, normal, vec3.fromValues(0.0, 0.0, 1.0));
			vec3.cross(c2, normal, vec3.fromValues(0.0, 1.0, 0.0));

			if (vec3.len(c1) > vec3.len(c2)) {
				tangent = vec3.clone(c1);
			} else {
				tangent = vec3.clone(c2);
			}

			vec3.normalize(tangent, tangent);
			tangent = [tangent[0], tangent[1], tangent[2]];
			this.tangents = this.tangents.concat(tangent);
		}
	}
	return this.tangents;
};

Geometry.prototype.invertNormals = function () {
	// invierte el type para que calcule las normales del otro tipo
	this.type = 1 - this.type;
};

/*
 * Nube de puntos compuesta por secciones que se van agregando
 * entre el [0.0, 1.0] del total de la nube. Todas las secciones
 * deben tener la misma cantidad de puntos.
 */
function PointCloud() {
	this.sections = []; // puntos y kernel de todas las secciones
}

// Métodos privados
PointCloud.prototype.newSection = function (path, at) {
	var strIndex = at.toFixed(2) + "";
	this.sections[strIndex] = [];
	this.sections[strIndex].points = path.getPoints();
	this.sections[strIndex].kernel = path.getKernelPoint();
};

PointCloud.prototype.getSection = function (sectionAt) {
	var keys = Object.keys(this.sections);

	var index = 0;
	for (var i = 0; i < keys.length - 1; i++) {
		var i1 = parseFloat(keys[i]);
		var i2 = parseFloat(keys[i + 1]);

		if (i2 <= sectionAt) {
			index = i2;
		} else {
			index = i1;
			break;
		}
	}

	return this.sections[index.toFixed(2) + ""];
};

PointCloud.prototype.addSection = function (path, at) {
	var initial = this.getSection(0);
	if (Utils.isDefined(initial)) {
		if (path.getPoints().length != initial.points.length) {
			alert("Error: la sección adicional debe tener la misma cantidad de puntos que la inicial");
			return;
		}

		// at: indica a partir de que parte del camino
		// ubicar la seccion (0: inicio, 1: fin)
		at = at > 1 ? 1 : at;
		this.newSection(path, at);
	} else {
		this.newSection(path, 0);
	}
};

PointCloud.prototype.getSectionPoints = function (sectionAt) {
	return this.getSection(sectionAt).points;
};

PointCloud.prototype.getSectionKernel = function (sectionAt) {
	return this.getSection(sectionAt).kernel;
};

PointCloud.prototype.getKernelPoint = function () {
	var keys = Object.keys(this.sections);

	var kernel = vec3.create();
	for (var i = 0; i < keys.length - 1; i++) {
		vec3.add(kernel, kernel, this.sections[keys[i]].kernel);
	}
	vec3.scale(kernel, kernel, 1 / keys.length);

	return kernel;
};

/*
 * Superficie de revolución. Se define una forma inicial de barrido
 * sobre el eje y la cantidad de caras. En cada angulo rotado imprimirá
 * el borde correspondiente. Los bordes que se definan luego deberán
 * tener exactamente la misma cantidad de puntos que el inicial.
 */
function RevolutionSurface(initialSideForm, faces) {
	Geometry.call(this);
	this.sideForms; // formatos de barrido de la revolución

	this.numbFaces; // cantidad de caras (mínimo 3)

	this.closedEndings = true; // agrega triángulos en los extremos
	this.centerInKernel = true; // centra el modelo generado en su kernel
	this.type = 1;

	this.init(initialSideForm, faces);
}

RevolutionSurface.prototype = Object.create(Geometry.prototype);
RevolutionSurface.prototype.constructor = RevolutionSurface;

RevolutionSurface.prototype.init = function (initialSideForm, faces) {
	if (Utils.isDefined(initialSideForm)) {
		this.sideForms = new PointCloud();
		this.numbFaces = faces < 3 ? 3 : faces;
		this.addSideForm(initialSideForm, 0);
	}
};

RevolutionSurface.prototype.setClosedEndings = function (closed) {
	this.closedEndings = closed;
};

RevolutionSurface.prototype.setCenteredInKernel = function (centered) {
	this.centerInKernel = centered;
};

RevolutionSurface.prototype.addSideForm = function (sideForm, at) {
	this.sideForms.addSection(sideForm, at);
};

// @override
RevolutionSurface.prototype.prepareGeometry = function () {
	var sideForms = this.sideForms;
	var cloudPointKernel = sideForms.getKernelPoint();

	var faces = this.numbFaces;
	var nodes = sideForms.getSectionPoints(0).length;

	if (this.closedEndings) {
		nodes += 2;
	}

	var angle = (2 * Math.PI) / faces;

	var vertices = [];

	for (var c = 0; c <= faces; c++) {
		// la revolucion se realiza sobre el eje Y
		var currPointSpace = mat4.create();
		mat4.rotate(currPointSpace, currPointSpace, angle * c, [0, 1, 0]);

		var currSideFormPoints = sideForms.getSectionPoints(c / faces);
		var currSideFormKernel = sideForms.getSectionKernel(c / faces);

		for (var n = 0; n < nodes; n++) {
			var vertex = vec3.create();
			var isEnding = this.closedEndings && (n === 0 || n === nodes - 1);
			var kernel = this.centerInKernel ? currSideFormKernel : cloudPointKernel;

			if (!isEnding) {
				var node = this.closedEndings ? n - 1 : n;
				var ykernel = vec3.fromValues(0, kernel[1], 0);
				vec3.subtract(vertex, currSideFormPoints[node], ykernel);
			} else {
				var idx = n === 0 ? 0 : nodes - 3;
				vec3.set(vertex, 0, currSideFormPoints[idx][1] - kernel[1], 0);
			}

			vec3.transformMat4(vertex, vertex, currPointSpace);
			vertex = [vertex[0], vertex[1], vertex[2]];
			//console.log(vertex);
			vertices = vertices.concat(vertex);
		}
	}

	//console.log(vertices.length);

	this.setVertices(vertices);
	this.defineDimensions(faces + 1, nodes);
};

/*
 * Superficie de barrido. Se define una figura inicial y un camino
 * de barrido. En cada punto del camino imprimirá la figura
 * correspondiente. Las figuras que se definan luego deberán tener
 * exactamente la misma cantidad de puntos que la inicial.
 */
function SweptSurface(sweptPath, initialShape) {
	Geometry.call(this);

	this.sweptPath; // recorrido donde se ubican las figuras
	this.shapes; // formas de corte a lo largo del camino

	this.closedShapes = true; // une los puntos iniciales y finales
	this.closedEndings = true; // agrega triangulos en los extremos
	this.centerInKernel = true; // centra el modelo generado en su kernel
	this.type = 0;

	this.init(sweptPath, initialShape);
}

SweptSurface.prototype = Object.create(Geometry.prototype);
SweptSurface.prototype.constructor = SweptSurface;

SweptSurface.prototype.init = function (sweptPath, initialShape) {
	if (Utils.isDefined(sweptPath) && Utils.isDefined(initialShape)) {
		this.shapes = new PointCloud();
		this.sweptPath = sweptPath;
		this.addShape(initialShape, 0);
	}
};

SweptSurface.prototype.setClosedShapes = function (closed) {
	this.closedShapes = closed;
};

SweptSurface.prototype.setClosedEndings = function (closed) {
	this.closedEndings = closed;
};

SweptSurface.prototype.setCenteredInKernel = function (centered) {
	this.centerInKernel = centered;
};

SweptSurface.prototype.addShape = function (shape, at) {
	this.shapes.addSection(shape, at);
};

// @override
SweptSurface.prototype.prepareGeometry = function () {
	var shapes = this.shapes;
	var cloudPointKernel = shapes.getKernelPoint();

	var path = this.sweptPath.getPoints();
	var pathKernel = this.sweptPath.getKernelPoint();

	var nodes = path.length;
	var faces = shapes.getSectionPoints(0).length;

	if (this.closedEndings) {
		nodes += 2;
	}

	if (this.closedShapes) {
		faces++;
	}

	var vertices = [];

	for (var n = 0; n < nodes; n++) {
		var currPointSpace = mat4.create();
		var up = [0, 1, 0];
		var isEnding = this.closedEndings && (n === 0 || n == nodes - 1);
		var currShapePoints;
		var currShapeKernel;

		if (!isEnding) {
			var node = this.closedEndings ? n - 1 : n;
			var totalNodes = nodes - (this.closedEndings ? 2 : 0);

			var actual = vec3.create();
			var next = vec3.create();
			var dir = vec3.create();

			vec3.copy(actual, path[node]);

			if (node < totalNodes - 1) {
				vec3.copy(next, path[node + 1]);
				vec3.subtract(dir, next, actual);
				vec3.normalize(dir, dir);
			} else {
				vec3.subtract(dir, actual, path[node - 1]);
				vec3.normalize(dir, dir);
				var last = vec3.create();
				vec3.add(last, dir, actual);
				next = last;
			}

			if (vec3.distance(up, dir) === 0) {
				// TODO: ver de arreglar este problema. El siguiente link parece util:
				// http://stackoverflow.com/questions/20923232/how-to-rotate-a-vector-by-a-given-direction
				console.error("Error: el recorrido definido tiene dirección igual al vector Up en algún tramo");
				return;
			}

			// desplaza la superficie al centro de coordenadas
			vec3.subtract(actual, actual, pathKernel);
			vec3.subtract(next, next, pathKernel);

			mat4.lookAt(currPointSpace, actual, next, up);
			// se usa la inversa cuando no se trata de una cámara
			mat4.invert(currPointSpace, currPointSpace);

			currShapePoints = shapes.getSectionPoints(node / totalNodes);
			currShapeKernel = shapes.getSectionKernel(node / totalNodes);
		}

		for (var c = 0; c < faces; c++) {
			var vertex = vec3.create();

			if (!isEnding) {
				var kernel = this.centerInKernel ? currShapeKernel : cloudPointKernel;

				var face = this.closedShapes && c == faces - 1 ? 0 : c;
				vec3.subtract(vertex, currShapePoints[face], kernel);
				vec3.transformMat4(vertex, vertex, currPointSpace);
			} else {
				var idx = n === 0 ? 0 : path.length - 1;
				vec3.subtract(vertex, path[idx], pathKernel);
			}

			vertex = [vertex[0], vertex[1], vertex[2]];
			//console.log(vertex);
			vertices = vertices.concat(vertex);
		}
	}

	//console.log(vertices.length);

	this.setVertices(vertices);
	this.defineDimensions(nodes, faces);
};

/* exported Color */
/*
 * Colores predefinidos
 */
var Color = Object.freeze({
	RED:		[1.0, 0.0, 0.0, 1.0],
	ORANGE:		[1.0, 0.6, 0.2, 1.0],
	GREEN:		[0.0, 1.0, 0.0, 1.0],
	BLUE:		[0.0, 0.0, 1.0, 1.0],
	YELLOW:		[1.0, 1.0, 0.0, 1.0],
	PURPLE:		[1.0, 0.0, 1.0, 1.0],
	BLACK:		[0.0, 0.0, 0.0, 1.0],
	WHITE:		[1.0, 1.0, 1.0, 1.0],
	GREY:		[0.5, 0.5, 0.5, 1.0],
	LIGHTGREY:	[0.7, 0.7, 0.7, 1.0],
	FORESTGREEN:	[0.13, 0.55, 0.13, 1.0],
	SKYBLUE:	[0.53, 0.81, 0.92, 1.0]
});

/*
 * Material con color
 */
function ColoredMaterial(color) {
	Material.call(this);
	this.color = color;
}

ColoredMaterial.prototype = Object.create(Material.prototype);

ColoredMaterial.prototype.constructor = ColoredMaterial;

ColoredMaterial.prototype.setColor = function (color) {
	this.color = color;
};

ColoredMaterial.prototype.setColorMappings = function (colors) {
	this.vertexMapping = colors;
};

// @override
ColoredMaterial.prototype.genetareMappings = function (levels, faces) {
	if (this.vertexMapping.length === 0) {
		for (var c = 0; c < levels * faces; c++) {
			this.vertexMapping = this.vertexMapping.concat(this.color);
		}
	}
};

// @override
ColoredMaterial.prototype.getColorMappings = function () {
	return this.vertexMapping;
};

// @override
ColoredMaterial.prototype.getTextureMappings = function () {
	return []; // devuelve un array vacio
};

// @override
ColoredMaterial.prototype.getShaderProgram = function () {
	if (this.supportsLight) {
		return new LightAndColorSP();
	} else {
		return new BasicColorSP();
	}
};

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

/*
 * Material que recubre un modelo. Tiene un shader asociado.
 */
function Material() {
	this.supportsLight = true; // flag para saber si el shader soporta iluminacion
	this.shininess = 10.0;

	this.cubeMap = null; // Cubic Reflection Map
	this.usingCubeMap = false;
	this.reflectionFactor = 1.0;

	this.vertexMapping = []; // mapeo del color o de la textura a los vertices
}
Material.prototype.setLightSupport = function (support) {
	this.supportsLight = support;
};

Material.prototype.hasLightSupport = function () {
	return this.supportsLight;
};

Material.prototype.setCubeMap = function (imgSrcs, refFactor) {
	this.cubeMap = new CubeMap(imgSrcs);
	this.usingCubeMap = true;
	this.reflectionFactor = refFactor;
};

Material.prototype.isUsingCubeMap = function () {
	return Utils.isDefined(this.cubeMap);
};

Material.prototype.getReflectionFactor = function () {
	return this.reflectionFactor;
};

Material.prototype.getShininess = function () {
	return this.shininess;
};

Material.prototype.setShininess = function (shininess) {
	this.shininess = shininess;
};

Material.prototype.prepareMaterial = function (gl) {
	// Este método será llamado en el momento de la
	// inicialización del material

	if (this.isUsingCubeMap()) {
		this.cubeMap.init(gl);
	}
};

Material.prototype.drawMaterial = function (gl) {
	// Este método será llamado en el momento del
	// dibujado del material

	if (this.isUsingCubeMap()) {
		this.cubeMap.bind(gl, gl.TEXTURE3);
	}
};

Material.prototype.genetareMappings = function (levels, faces) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Material.prototype.getColorMappings = function () {
	console.error("Error: Abstract method not implemented");
};

Material.prototype.getTextureMappings = function () {
	console.error("Error: Abstract method not implemented");
};

Material.prototype.getShaderProgram = function () {
	console.error("Error: Abstract method not implemented");
};

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

/*
 * Material con textura
 */
function TexturedMaterial(imgSrc) {
	Material.call(this);
	this.texture = new Texture(imgSrc);
	this.lightMap = null;
	this.normalMap = null; // Bump Map

	this.transforms = mat3.create(); // matriz de transformaciones 2d
	this.mosaic = [true, true]; // coordenadas <0 y >1 repiten la textura

	this.usingLightMap = false;
	this.usingNormalMap = false;

	this.lightMapFactor;
}

TexturedMaterial.prototype = Object.create(Material.prototype);
TexturedMaterial.prototype.constructor = TexturedMaterial;

TexturedMaterial.prototype.setTexture = function (texture) {
	this.texture = texture;
};

TexturedMaterial.prototype.isUsingLightMap = function () {
	return Utils.isDefined(this.lightMap);
};

TexturedMaterial.prototype.isUsingNormalMap = function () {
	return Utils.isDefined(this.normalMap);
};

TexturedMaterial.prototype.setLightMap = function (imgSrc, factor) {
	this.lightMap = new Texture(imgSrc);
	this.lightMapFactor = factor;
	this.usingLightMap = true;
};

TexturedMaterial.prototype.setNormalMap = function (imgSrc) {
	this.normalMap = new Texture(imgSrc);
	this.usingNormalMap = true;
};

TexturedMaterial.prototype.setTextureMappings = function (texcoords) {
	this.vertexMapping = texcoords;
};

TexturedMaterial.prototype.mosaic = function (u, v) {
	this.mosaic = [u, v];
};

TexturedMaterial.prototype.rotate = function (rad) {
	mat3.rotate(this.transforms, this.transforms, rad);
};

TexturedMaterial.prototype.translate = function (u, v) {
	var vec = vec2.fromValues(u, v);
	mat3.translate(this.transforms, this.transforms, vec);
};

TexturedMaterial.prototype.scale = function (u, v) {
	var vec = vec2.fromValues(u, v);
	mat3.scale(this.transforms, this.transforms, vec);
};

// @override
TexturedMaterial.prototype.prepareMaterial = function (gl) {
	Material.prototype.prepareMaterial.call(this, gl);

	this.texture.init(gl, this.mosaic);
	if (this.isUsingLightMap()) {
		this.lightMap.init(gl, this.mosaic);
	}
	if (this.isUsingNormalMap()) {
		this.normalMap.init(gl, this.mosaic);
	}
};

// @override
TexturedMaterial.prototype.drawMaterial = function (gl) {
	Material.prototype.drawMaterial.call(this, gl);

	this.texture.bind(gl, gl.TEXTURE0);
	if (this.isUsingLightMap()) {
		this.lightMap.bind(gl, gl.TEXTURE1);
	}
	if (this.isUsingNormalMap()) {
		this.normalMap.bind(gl, gl.TEXTURE2);
	}
};

// @override
TexturedMaterial.prototype.genetareMappings = function (levels, faces) {
	if (this.vertexMapping.length === 0) {
		for (var n = 0; n < levels; n++) {
			for (var c = 0; c < faces; c++) {
				var u = n / (levels - 1);
				var v = c / (faces - 1);

				var vec = vec2.fromValues(u, v);
				vec2.transformMat3(vec, vec, this.transforms);
				this.vertexMapping = this.vertexMapping.concat([vec[0], vec[1]]);
			}
		}
	}
};

// @override
TexturedMaterial.prototype.getColorMappings = function () {
	return []; // devuelve un array vacio
};

// @override
TexturedMaterial.prototype.getTextureMappings = function () {
	return this.vertexMapping;
};

// @override
TexturedMaterial.prototype.getShaderProgram = function () {
	if (this.supportsLight) {
		return new LightAndTextureSP();
	} else {
		return new BasicTextureSP();
	}
};

/*
 * Modelo transformable y renderizable como parte de una escena
 */
function Model() {
	this.parent; // modelo padre

	this.initialized; // informa si está listo para renderizarse

	Transformable.call(this);

	this.setInitialized(false);
}

Model.prototype = Object.create(Transformable.prototype);
Model.prototype.constructor = Model;

// Métodos públicos
Model.prototype.setInitialized = function (state) {
	this.initialized = state;

	if (state === false && Utils.isDefined(this.parent)) {
		this.parent.setInitialized(false);
	}
};

Model.prototype.isInitialized = function () {
	return this.initialized;
};

// Métodos abstractos
Model.prototype.prepareToRender = function (gl) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Model.prototype.setRenderMatrixes = function (mMatrix, vMatrix, pMatrix) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Model.prototype.setLights = function (gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Model.prototype.draw = function (gl) { // jshint ignore:line
	console.error("Error: Abstract method not implemented");
};

Model.prototype.callUpdate = function (obj, elapsedTime) {
	obj.update.call(this, elapsedTime);
};

Model.prototype.update = function (elapsedTime) { // jshint ignore:line
	// Se llama en cada ciclo
};

/*
 * Modelo simple con buffers y shaders asociados. Es un único poliedro.
 * Está definido por una geometría y un material que lo recubre.
 */
function PrimitiveModel(geometry, material) {
	Model.call(this);

	this.shaderProgram;

	this.renderMatrixes; // Model, View y Projection
	this.renderModeId; // modo de renderizado del index buffer

	this.geometry;
	this.material;

	this.vertexBuffer;
	this.indexBuffer;
	this.normalBuffer;
	this.tangentBuffer;
	this.colorBuffer;
	this.textureBuffer;

	this.init(geometry, material);
}

PrimitiveModel.prototype = Object.create(Model.prototype);
PrimitiveModel.prototype.constructor = PrimitiveModel;

PrimitiveModel.RenderMode = Object.freeze({
	TRIANGLE_STRIP: 0,
	TRIANGLE_FAN: 1,
	LINES: 2,
	LINE_STRIP: 3
});

PrimitiveModel.prototype.initBuffers = function (gl) {
	this.vertexBuffer = new AttributeBuffer(gl);
	this.vertexBuffer.setData(3, this.geometry.getVertices());

	this.indexBuffer = new IndexBuffer(gl);
	this.indexBuffer.setData(this.geometry.getIndexes());

	this.normalBuffer = new AttributeBuffer(gl);
	this.normalBuffer.setData(3, this.geometry.getNormals());

	this.tangentBuffer = new AttributeBuffer(gl);
	this.tangentBuffer.setData(3, this.geometry.getTangents());

	this.colorBuffer = new AttributeBuffer(gl);
	this.colorBuffer.setData(4, this.material.getColorMappings());

	this.textureBuffer = new AttributeBuffer(gl);
	this.textureBuffer.setData(2, this.material.getTextureMappings());
};

PrimitiveModel.prototype.getGlRenderMode = function (gl) {
	switch (this.renderModeId) {
	case PrimitiveModel.RenderMode.TRIANGLE_STRIP:
		return gl.TRIANGLE_STRIP;
	case PrimitiveModel.RenderMode.TRIANGLE_FAN:
		return gl.TRIANGLE_FAN;
	case PrimitiveModel.RenderMode.LINES:
		return gl.LINES;
	case PrimitiveModel.RenderMode.LINE_STRIP:
		return gl.LINE_STRIP;
	default:
		return gl.TRIANGLE_STRIP;
	}
};

PrimitiveModel.prototype.setRenderMode = function (rm) {
	this.renderModeId = rm;
};

PrimitiveModel.prototype.init = function (geometry, material) {
	if (Utils.isDefined(geometry) && Utils.isDefined(material)) {
		this.renderMatrixes = [];
		this.geometry = geometry;
		this.material = material;
		this.dir = vec3.create();
		this.geometry.prepareGeometry();

		// genera los atributos de color o textura según el caso
		var levels = this.geometry.levels;
		var faces = this.geometry.faces;
		this.material.genetareMappings(levels, faces);

		// obtiene el shader program a utilizar
		this.shaderProgram = this.material.getShaderProgram();
	}
};

// @override
PrimitiveModel.prototype.prepareToRender = function (gl) {
	this.shaderProgram.init(gl);
	this.material.prepareMaterial(gl);
	this.initBuffers(gl);
	this.setInitialized(true);
};

// @override
PrimitiveModel.prototype.setRenderMatrixes = function (mMatrix, vMatrix, pMatrix) {
	this.renderMatrixes.model = mat4.clone(mMatrix);
	this.renderMatrixes.view = mat4.clone(vMatrix);
	this.renderMatrixes.projection = mat4.clone(pMatrix);
};

// @override
PrimitiveModel.prototype.setLights = function (gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection) {
	this.shaderProgram.useThisProgram(gl);

	var useLight = this.material.hasLightSupport();
	gl.uniform1i(this.shaderProgram.getUniform("uUseLighting"), useLight);
	gl.uniform1f(this.shaderProgram.getUniform("uShininess"), this.material.getShininess());
	gl.uniform3f(this.shaderProgram.getUniform("uAmbientColor"), amb, amb, amb);
	gl.uniform3f(this.shaderProgram.getUniform("uDirectionalColor"), dir, dir, dir);
	gl.uniform3fv(this.shaderProgram.getUniform("uLightPosition"), pos);

	gl.uniform3f(this.shaderProgram.getUniform("uCarLightColor"), carLightColor, carLightColor, carLightColor);
	gl.uniform3fv(this.shaderProgram.getUniform("uCarLightTransformedPosition"), transformedCarLight);
	gl.uniform3fv(this.shaderProgram.getUniform("uCarLightTransformedDirection"), transformedCarLightDirection);

	gl.uniform1i(this.shaderProgram.getUniform("uUsingLightMap"), this.material.usingLightMap);

	gl.uniform1f(this.shaderProgram.getUniform("uLightMapFactor"), this.material.lightMapFactor);

	gl.uniform1i(this.shaderProgram.getUniform("uUsingNormalMap"), this.material.usingNormalMap);

	gl.uniform1f(this.shaderProgram.getUniform("uReflectionFactor"), this.material.getReflectionFactor());
	gl.uniform1i(this.shaderProgram.getUniform("uUsingReflectionMap"), this.material.usingCubeMap);
};

// @override
PrimitiveModel.prototype.draw = function (gl) {
	var matrixes = this.renderMatrixes;

	// Obtiene las matrices de una rama del Arbol de la Escena
	var sceneTwig = [this.objectMatrix];
	var parent = this.parent;
	while (Utils.isDefined(parent)) {
		sceneTwig.push(parent.objectMatrix);
		parent = parent.parent;
	}

	// Obtiene la matriz Model-View
	var mvMatrix = mat4.create();
	mat4.multiply(mvMatrix, matrixes.view, matrixes.model);

	// Multiplica las matrices en el orden correcto
	for (var i = sceneTwig.length - 1; i >= 0; i--) {
		mat4.multiply(mvMatrix, mvMatrix, sceneTwig[i]);
	}

	// Setea el programa de shaders dinámicamente para cada modelo
	var program = this.shaderProgram;
	program.useThisProgram(gl);

	// asocio la pMatrix con la del shader
	gl.uniformMatrix4fv(program.getUniform("uPMatrix"), 0, matrixes.projection);

	// asocio la mvMatrix con la del shader
	gl.uniformMatrix4fv(program.getUniform("uMVMatrix"), 0, mvMatrix);

	// calculo y asocio la nMatrix con la del shader
	var nMatrix = mat3.create();
	mat3.normalFromMat4(nMatrix, mvMatrix);
	gl.uniformMatrix3fv(program.getUniform("uNMatrix"), 0, nMatrix);

	// Asociamos un atributo del shader con cada uno de los buffers que creamos
	program.associateAttribute(this.vertexBuffer, "aVertexPosition");
	program.associateAttribute(this.normalBuffer, "aVertexNormal");
	program.associateAttribute(this.tangentBuffer, "aVertexTangent");
	program.associateAttribute(this.colorBuffer, "aVertexColor");
	program.associateAttribute(this.textureBuffer, "aTextureCoord");

	// hago un bind de la textura antes de dibujarla
	this.material.drawMaterial(gl);
	gl.uniform1i(program.getUniform("uSampler"), 0);
	gl.uniform1i(program.getUniform("uSamplerLightMap"), 1);
	gl.uniform1i(program.getUniform("uSamplerNormalMap"), 2);
	gl.uniform1i(program.getUniform("uReflectionMap"), 3);

	// Dibujamos el modelo
	this.indexBuffer.draw(this.getGlRenderMode(gl));
};

/*
 * Modelo compuesto de otros modelos hijos
 */
function ComplexModel() {
	Model.call(this);
	this.children = []; // modelos hijos
}

ComplexModel.prototype = Object.create(Model.prototype);
ComplexModel.prototype.constructor = ComplexModel;

// @override
ComplexModel.prototype.prepareToRender = function (gl) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].prepareToRender(gl);
	}
	this.setInitialized(true);
};

// @override
ComplexModel.prototype.setRenderMatrixes = function (mMatrix, vMatrix, pMatrix) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].setRenderMatrixes(mMatrix, vMatrix, pMatrix);
	}
};

// @override
ComplexModel.prototype.setLights = function (gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].setLights(gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos);
	}
};

// @override
ComplexModel.prototype.draw = function (gl) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].draw(gl);
	}
};

// @override
ComplexModel.prototype.callUpdate = function (obj, elapsedTime) {
	Model.prototype.callUpdate.call(this, obj, elapsedTime);

	for (var i = 0; i < this.children.length; i++) {
		this.children[i].callUpdate(this.children[i], elapsedTime);
	}
};

ComplexModel.prototype.addChild = function (child) {
	child.parent = this;
	this.children.push(child);
};

/*
 * Camara abstracta de base para otras camaras
 */
function Camera() {
	Transformable.call(this);
	this.up; // vector hacia arriba
	this.target; // punto donde mira

	this.setUp(0, -1, 0);

	// mira al centro de la escena por default
	this.setTarget(0, 0, 0);
}

Camera.prototype = Object.create(Transformable.prototype);

Camera.prototype.constructor = Camera;

Camera.prototype.setUp = function (x, y, z) {
	// TODO: ver como solucionar el problema cuando coinciden 
	// el vector Up con la dirección entre Eye y Target
	this.up = vec3.fromValues(x, y, z);
};

Camera.prototype.setTarget = function (x, y, z) {
	this.target = vec3.fromValues(x, y, z);
};

Camera.prototype.getViewMatrix = function () {
	var eye = this.getPosition();
	var lookat = mat4.create();
	mat4.lookAt(lookat, eye, this.target, this.up);
	return lookat;
};

Camera.prototype.getAlignedWithCamera = function (vector) {
	// alinea un vector según el Up de la camara
	var lookat = this.getViewMatrix();
	var aligned = vec3.create();
	vec3.transformMat4(aligned, vector, lookat);
	return aligned;
};

Camera.prototype.getProjectionMatrix = function () {
	console.error("Error: Abstract method not implemented");
};

/*
 * Camara para enfocar la escena en perspectiva
 */
function PerspectiveCamera(w, h) {
	Camera.call(this);

	this.pMatrix = mat4.create();

	// matriz de perspectiva por default
	this.setPerspective(30, w / h, 0.1, 1600.0);
}

PerspectiveCamera.prototype = Object.create(Camera.prototype);

PerspectiveCamera.prototype.constructor = PerspectiveCamera;

PerspectiveCamera.prototype.setPerspective = function (fov, aspect, near, far) {
	// Preparamos una matriz de perspectiva
	mat4.identity(this.pMatrix);
	mat4.perspective(this.pMatrix, fov, aspect, near, far);
};

// @override
PerspectiveCamera.prototype.getProjectionMatrix = function () {
	return this.pMatrix;
};

/*
 * Ejes coordenados
 */
function Axis() {
	PrimitiveModel.call(this);

	var vertices = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1];
	var indexes = [0, 1, 2, 3, 4, 5];
	var colors = [];

	colors = colors.concat(Color.RED);
	colors = colors.concat(Color.RED);
	colors = colors.concat(Color.GREEN);
	colors = colors.concat(Color.GREEN);
	colors = colors.concat(Color.BLUE);
	colors = colors.concat(Color.BLUE);

	this.setRenderMode(PrimitiveModel.RenderMode.LINES);

	var geometry = new Geometry();
	geometry.setVertices(vertices);
	geometry.setIndexes(indexes);

	var material = new ColoredMaterial();
	material.setColorMappings(colors);
	material.setLightSupport(false);

	this.init.call(this, geometry, material);
}

Axis.prototype = Object.create(PrimitiveModel.prototype);
Axis.prototype.constructor = Axis;

/*
 * Dibuja los vectores normales a los vértices de una geometría
 */
function NormalsGrapher(model) {
	PrimitiveModel.call(this);
	this.model = model;
}

NormalsGrapher.prototype = Object.create(PrimitiveModel.prototype);
NormalsGrapher.prototype.constructor = NormalsGrapher;

// @override
NormalsGrapher.prototype.prepareToRender = function (gl) {
	var model = this.model;

	this.applyTransformationMatrix(model.getObjectMatrix(), true);
	var modelV = model.geometry.getVertices();
	var modelN = model.geometry.getNormals();

	var vertices = [];
	var indexes = [];
	var colors = [];
	var i;

	for (i = 0; i < modelV.length; i += 3) {
		vertices.push(modelV[i]);
		vertices.push(modelV[i + 1]);
		vertices.push(modelV[i + 2]);

		var n = vec3.fromValues(modelN[i], modelN[i + 1], modelN[i + 2]);
		var v = vec3.fromValues(modelV[i], modelV[i + 1], modelV[i + 2]);

		vec3.scale(n, n, 0.5);
		vec3.add(n, n, v);

		vertices.push(n[0]);
		vertices.push(n[1]);
		vertices.push(n[2]);
	}

	for (i = 0; i < vertices.length / 3; i++) {
		indexes.push(i);
		colors = colors.concat(Color.RED);
	}

	this.setRenderMode(PrimitiveModel.RenderMode.LINES);

	var geometry = new Geometry();
	geometry.setVertices(vertices);
	geometry.setIndexes(indexes);

	var material = new ColoredMaterial();
	material.setColorMappings(colors);
	material.setLightSupport(false);

	this.init(geometry, material);
	PrimitiveModel.prototype.prepareToRender.call(this, gl);
};
/*
 * Poligono 2D plano, convexo (Star-shaped polygon) y centrado en el origen.
 * Recibe una figura (shape) y un color. Es un poliedro de 1 cara.
 */
function Polygon(shape, color) {
	PrimitiveModel.call(this);
	this.points;
	this.kernel;
	this.fill = true; // si es false solo dibuja el contorno
	this.closed = true;
	this.color;

	this.init(shape, color);
}

Polygon.prototype = Object.create(PrimitiveModel.prototype);
Polygon.prototype.constructor = Polygon;

Polygon.prototype.setColor = function (color) {
	if (this.color != color) {
		this.color = color;
		this.setInitialized(false);
	}
};

Polygon.prototype.init = function (shape, color) {
	if (Utils.isDefined(shape)) {
		this.points = shape.getPoints();
		this.kernel = shape.getKernelPoint();
		this.color = color;
		this.setInitialized(false);
	}
};

Polygon.prototype.fillPolygon = function (fill) {
	this.fill = fill;
	this.setInitialized(false);
};

Polygon.prototype.closedPolygon = function (closed) {
	this.closed = closed;
	this.setInitialized(false);
};

// @override
Polygon.prototype.prepareToRender = function (gl) {
	var points = this.points;
	var kernel = this.kernel;

	var z = 0;
	var normDir = [0, 0, 1];
	var vertices = [0, 0, z];
	var normals = normDir;
	var colors = this.color;
	var indexes = [];

	if (this.fill) {
		indexes = indexes.concat(0);
	}

	for (var p = 0; p < points.length; p++) {
		// se le resta xKernel y yKernel para centrarlo en el origen
		var x = points[p][0] - kernel[0];
		var y = points[p][1] - kernel[1];

		vertices = vertices.concat([x, y, z]);
		normals = normals.concat(normDir);
		indexes = indexes.concat(p + 1);
		colors = colors.concat(this.color);
	}

	if (this.closed) { // une el primer y último punto
		indexes = indexes.concat(1);
	}

	var renderMode = PrimitiveModel.RenderMode.LINE_STRIP;
	if (this.fill) {
		renderMode = PrimitiveModel.RenderMode.TRIANGLE_FAN;
	}

	this.setRenderMode(renderMode);

	var geometry = new Geometry();
	geometry.setVertices(vertices);
	geometry.setNormals(normals);
	geometry.setIndexes(indexes);

	var material = new ColoredMaterial(this.color);
	material.setColorMappings(colors);

	PrimitiveModel.prototype.init.call(this, geometry, material);
	PrimitiveModel.prototype.prepareToRender.call(this, gl);
};

/*
    TODO: ver de implementar algún algoritmo de estos:
    http://en.wikipedia.org/wiki/Star-shaped_polygon
    http://en.wikipedia.org/wiki/Polygon_triangulation
    http://stackoverflow.com/questions/471962/how-do-determine-if-a-polygon-is-complex-convex-nonconvex
*/

/*
 * Rectangulo plano con un material aplicado
 */
function Sprite(width, height, material) {
	PrimitiveModel.call(this);

	var w = width;
	var h = height;
	var vertices = [-w / 2, -h / 2, 0, -w / 2, h / 2, 0, w / 2, -h / 2, 0, w / 2, h / 2, 0];
	var indexes = [0, 1, 2, 3];
	var normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
	var tangents = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];

	var geometry = new Geometry();
	geometry.setVertices(vertices);
	geometry.setIndexes(indexes);
	geometry.setNormals(normals);
	geometry.setTangents(tangents);
	geometry.defineDimensions(2, 2);

	this.init(geometry, material);
}

Sprite.prototype = Object.create(PrimitiveModel.prototype);

Sprite.prototype.constructor = Sprite;

/*
 * Caja
 */
function Box(width, height, depth, material) {
	PrimitiveModel.call(this);

	var path = new Path(1);
	path.addStretch(new LinearCurve([[0, 0], [depth, 0]]));

	var rectangle = new Rectangle(width, height);
	var geometry = new SweptSurface(path, rectangle);

	this.init(geometry, material);
}

Box.prototype = Object.create(PrimitiveModel.prototype);

Box.prototype.constructor = Box;

/*
 * Prisma
 */
function Prism(radius1, radius2, height, faces, material) {
	PrimitiveModel.call(this);

	var side = new Path(2);
	side.addStretch(new LinearCurve([[radius1, 0], [radius2, height]]));

	this.geometry = new RevolutionSurface(side, faces);
	this.material = material;
}

Prism.prototype = Object.create(PrimitiveModel.prototype);
Prism.prototype.constructor = Prism;

// @override
Prism.prototype.prepareToRender = function (gl) {
	this.init(this.geometry, this.material);
	PrimitiveModel.prototype.prepareToRender.call(this, gl);
};

/*
 * Esfera
 */
function Sphere(radius, faces, material) {
	PrimitiveModel.prototype.constructor.call(this);

	var r = radius * 0.5;
	var c = 0.55191502 * r;

	var side = new Path(10);
	side.addStretch(new CubicBezier([[0, r], [c, r], [r, c], [r, 0]]));
	side.addStretch(new CubicBezier([[r, 0], [r, -c], [c, -r], [0, -r]]));

	var geometry = new RevolutionSurface(side, faces);
	geometry.setClosedEndings(false);

	this.init(geometry, material);
}

Sphere.prototype = Object.create(PrimitiveModel.prototype);
Sphere.prototype.constructor = Sphere;

/*
 * Círculo
 */
function Circle(radius) {
	Path.call(this, 10);

	var r = radius;
	var c = 0.55191502 * r;
	var curve1 = new CubicBezier([[0, r], [c, r], [r, c], [r, 0]]);
	var curve2 = new CubicBezier([[r, 0], [r, -c], [c, -r], [0, -r]]);
	var curve3 = new CubicBezier([[0, -r], [-c, -r], [-r, -c], [-r, 0]]);
	var curve4 = new CubicBezier([[-r, 0], [-r, c], [-c, r], [0, r]]);

	this.addStretch(curve1);
	this.addStretch(curve2);
	this.addStretch(curve3);
	this.addStretch(curve4);
}

Circle.prototype = Object.create(Path.prototype);
Circle.prototype.constructor = Circle;

/*
 * Rectángulo
 */
function Rectangle(width, height) {
	Path.call(this, 1);
	var rectangle = new LinearCurve([[0, 0], [0, height], [width, height], [width, 0]]);
	this.addStretch(rectangle);
}

Rectangle.prototype = Object.create(Path.prototype);

Rectangle.prototype.constructor = Rectangle;

/*
 * Trapecio
 */
function Trapezoid(longSide, shortSide, height) {
	Path.call(this, 1);
	var halfLongSide = longSide/2;
	var halfShortSide = shortSide/2;
	var trapezoid = new LinearCurve([[-halfLongSide, 0],
									 [-halfShortSide, height],
									 [halfShortSide, height],
									 [halfLongSide, 0]]);
	this.addStretch(trapezoid);
}

Trapezoid.prototype = Object.create(Path.prototype);
Trapezoid.prototype.constructor = Trapezoid;

/*
 * TriCírculo
 */
function TriCircle(radius) {
	Path.call(this, 10);

	var circle1 = new Circle(radius);
	var circle2 = new Circle(radius/2);
	var circle3 = new Circle(radius);

	circle1.translateY(10);
	circle2.translateX(-5);
	circle3.translateY(-10);

	this.addStretch(circle1);
	this.addStretch(circle2);
	this.addStretch(circle3);	

}

TriCircle.prototype = Object.create(Path.prototype);
TriCircle.prototype.constructor = TriCircle;
