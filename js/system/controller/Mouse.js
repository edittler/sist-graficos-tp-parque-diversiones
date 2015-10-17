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
		return Mouse._deltaX != 0 || Mouse._deltaY != 0;
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
		return Mouse._wheelDelta != 0;
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