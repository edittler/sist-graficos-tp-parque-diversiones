var lastTime = 0; // Tiempo de la última vez que se ejecutó la animación

var renderer, escena, simulador;

var piso, fondo, auto;

var camara, camaraOrbital, camaraSeguimiento, camaraPrimeraPersona;

var ambientColor, directionalColor, directionalPosition;
var spotlightColor, spotlightPosition, spotlightDirection;

function start() {
	init();
	loop();
}

function init() {
	var up = vec3.fromValues(0, 0, -1);

	var w = window.innerWidth - 1;
	var h = window.innerHeight - 4;

	renderer = new Renderer(w, h);

	// ubico el canvas del renderer en el body
	var canvasContainer = document.getElementById("canvas-container");
	canvasContainer.appendChild(renderer.getCanvasElement());

	// CREAR OBJETOS

	piso = new Piso();

	fondo = new Fondo();
	fondo.translateY(200);

	escena = new Scene();

	// habilita la iluminacion
	ambientColor = 0.8;
	directionalColor = 0.4;
	spotlightColor = 0.0;

	directionalPosition = [-600, 200, 400];
	spotlightPosition = [10.0, 0.0, 0.0];
	spotlightDirection = [1.0, 0.0, -0.7]; // TODO deberia ser -1,0,0

	//escena.setAuto(auto);
	escena.setLightSources(ambientColor, directionalColor, directionalPosition, spotlightColor, spotlightPosition, spotlightDirection);

	// AGREGAR OBJETOS A LA ESCENA

	escena.add(piso);
	escena.add(fondo);

	var eyeSeguimiento = vec3.fromValues(-20, 0, 3);
	var targetSeguimiento = vec3.fromValues(-4, 0, 0);
	//camaraSeguimiento = new CamaraSeguimiento(auto, eyeSeguimiento, targetSeguimiento, up);

	var eyeOrbital = vec3.fromValues(0,100,20);
	var targetOrbital= vec3.fromValues(0,0,-10)
	camaraOrbital = new CamaraOrbital(w, h, eyeOrbital, targetOrbital, up);
	camara = camaraOrbital;

	var eyePP = vec3.fromValues(0,0,6);
	var targetPP= vec3.fromValues(3,0,6);
	//camaraPrimeraPersona = new CamaraPrimeraPersona(eyePP, targetPP, up);
}

/*
 * Función que calcula el tiempo delta.
 * El tiempo delta consiste en determinar el número de milisegundos
 * transcurridos desde la última ejecución de la función animate, y mover
 * los objetos en consecuencia según la velocidad por segundo que nosotros
 * le hayamos dicho que tienen.
 * Con el método de tiempo delta, nos aseguramos a que el objeto siempre
 * mantenga una velocidad de animación constante, y que se vea igual en toda
 * clase de ordenadores lentos o rápidos (siempre que tengan un mínimo
 * de potencia para mover webgl con cierta fluidez, claro).
 */
function elapsedTime() {
	var timeNow = new Date().getTime();
	var elapsed = 0;
	if (lastTime !== 0) {
		elapsed = timeNow - lastTime;
	}
	lastTime = timeNow;
	return elapsed;
}

/*
 * Función que ejecuta la animación.
 * Hace uso de la función requestAnimationFrame que notifica al navegador
 * que debe volver a pintar la escena webGL.
 * Se podría conseguir un efecto similar al uso de requestAnimFrame,
 * pidiéndole que sea javascript el que llame a la función drawScene
 * con regularidad.
 * Dado que el setInterval de javascript se ejecuta esté la pestaña abierta
 * o no, ésto supone un increíble desperdicio de rendimiento, que podría
 * acabar perjudicando a la velocidad de ejecución de los javascripts.
 * Sin embargo, requestAnimFrame sólo se llama cuando el canvas donde
 * se dibuja la escene está visible.
 */
function loop() {
	requestAnimationFrame(loop);

	var tick = elapsedTime();

	//listenToKeyboard(tick);
	//listenToMouse();

	//simulador.update();
	//camaraSeguimiento.update();

	escena.update();  // actualiza todos los modelos
	renderer.render(escena, camara.getPerspectiveCamera());
	//auto.guardarCaniones(tick);
}
