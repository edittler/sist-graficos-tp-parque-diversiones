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
        if(Utils.isDefined(singleInput) && singleInput)
            delete this._pressed[keyCode];
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