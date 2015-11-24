
/*
 * Fondo
 */
function Fondo() {
	var material = new ColoredMaterial(Color.SKYBLUE);
	//var material = new TexturedMaterial("images/background.jpg");
	//var images = ["images/beach/front.jpg", "images/beach/back.jpg",
	//			  "images/beach/bottom.jpg", "images/beach/top.jpg",
	//			  "images/beach/left.jpg", "images/beach/right.jpg"];
	//material.setCubeMap(images, 2.0);
	material.setLightSupport(false);
	//material.scale(0.5, 0.5);
	//material.translate(2.3, 0.4);

	Prism.call(this, 900, 900, 1200, 24, material);
	this.geometry.setClosedEndings(true);

	this.rotateX(Utils.degToRad(90));
	this.rotateY(Utils.degToRad(270 + 45));
}

Fondo.prototype = Object.create(Prism.prototype);

Fondo.prototype.constructor = Fondo;

/*
 * Carro de la Montania Rusa
 */
function Carro(path) {
	ComplexModel.call(this);

	this.curva = new CubicBSpline(path);

	var precision = 24;

	this.puntos = this.curva.getPoints(precision);
	this.derivadas = this.curva.getDerivativePoints(precision);
	this.recorrido = new Path(8);
	this.recorrido.addStretch(this.curva);

	var material = new ColoredMaterial(Color.RED);
	var ancho = 10;
	var largo = 20;
	var alto = 5;
	this.caja = new Box(ancho, alto, largo, material);

	this.axis = new Axis();
	this.axis.scale(20);

	this.addChild(this.caja);
	this.addChild(this.axis);

	this.velocidad = 0.01;
	this.direccion = vec3.fromValues(1.000001, 0.000001, 0.000001);
	vec3.normalize(this.direccion, this.direccion);
	this.distanciaRecorrida = 0;
}

Carro.prototype = Object.create(ComplexModel.prototype);
Carro.prototype.constructor = Carro;

//@override
Carro.prototype.update = function (elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);

	//posVec,tanVec,nrmVec,binVec

	// calculo posicion sobre la curva
	this.distanciaRecorrida += (elapsedTime) * this.velocidad;
	var modDistancia = Math.floor(this.distanciaRecorrida) % this.puntos.length;
	var point = this.puntos[modDistancia];
	//var pos = vec3.fromValues(point[0], point[1], point[2]);

	// calculo tangente de la curva
	var derivada = this.derivadas[modDistancia];
	var tan = vec3.fromValues(derivada[0], derivada[1], derivada[2]);
	vec3.normalize(tan, tan);
	//console.log("X: " + tan[0] + " Y: " + tan[1] + " Z: " + tan[2]);

	/*
	// defino el vector UP
	var UP = vec3.fromValues(0, 1, 0);

	//bin = UP x tan (producto vectorial)
	var bin = vec3.create();
	vec3.cross(bin, UP, tan);

	//nrm = tan x bin
	var nrm = vec3.create();
	vec3.cross(nrm, tan, bin);
	*/

	this.setPosition(point[0], point[1], point[2]);
	this.rotateZ(this.angleZ(tan));
	//this.rotateY(this.angleY(tan));
	this.rotateY(this.angleX(tan) - Math.PI / 2);
};

Carro.prototype.angleZ = function (vec) {
	var a = vec3.clone(this.direccion);
	var b = vec3.clone(vec);
	a = this.rotarAlPlanoXY(a);
	b = this.rotarAlPlanoXY(b);
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = Utils.angleBetweenVectors(a, b);
	//console.log("Angle Z: " + angle + " Z Direction: " + cross[2]);
	if (cross[2] < 0) {
		//angle *= -1;
	}
	return angle;
};

Carro.prototype.angleY = function (vec) {
	var a = this.direccion;
	var b = vec3.clone(vec);
	a[1] = 0;
	//console.log("X Direction: " + b[0] + " Y Direction: " + b[1] + " Z Direction: " + b[2]);
	b[1] = 0;
	/*
	if (vec3.length(b)) {
		return 0;
	}
	*/
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = Utils.angleBetweenVectors(a, b);
	console.log("Angle Y: " + angle + " Y Direction: " + cross[1]);
	/*
	if (cross[1] < 0) {
		angle *= -1;
	}
	*/
	return angle - Math.PI / 2;
	//return 0;
};

Carro.prototype.angleX = function (vec) {
	var a = vec3.clone(this.direccion);
	var b = vec3.clone(vec);
	a = this.rotarAlPlanoYZ(a);
	b = this.rotarAlPlanoYZ(b);
	var cross = vec3.create();
	vec3.cross(cross, a, b);
	var angle = Utils.angleBetweenVectors(a, b);
	//console.log("Angle X: " + angle + " X Direction: " + cross[1]);
	if (cross[0] > 0) {
		angle *= -1;
	}
	return angle;
};

Carro.prototype.rotarAlPlanoXY = function (vec) {
	if (vec[2] === 0) {
		return vec;
	}
	var catAdy, c1, c2, c3, c4;
	if (vec[0] > vec[1]) {
		catAdy = vec[0];
		c1 = 0;
		c2 = 2;
		c3 = 8;
		c4 = 10;
	} else {
		catAdy = vec[1];
		c1 = 5;
		c2 = 6;
		c3 = 9;
		c4 = 10;
	}
	var dis = Math.sqrt(catAdy * catAdy + vec[2] * vec[2]);
	var mat = mat4.create();
	var cos = catAdy / dis;
	var sen = vec[2] / dis;
	mat[c1] = cos;
	mat[c2] = sen;
	mat[c3] = sen;
	mat[c4] = -cos;
	var vecRot = vec3.create();
	vec3.transformMat4(vecRot, vec, mat);
	return vecRot;
};

Carro.prototype.rotarAlPlanoYZ = function (vec) {
	if (vec[0] === 0) {
		return vec;
	}
	var catAdy, c1, c2, c3, c4;
	if (vec[1] > vec[2]) {
		catAdy = vec[1];
		c1 = 0;
		c2 = 1;
		c3 = 4;
		c4 = 5;
	} else {
		catAdy = vec[2];
		c1 = 0;
		c2 = 2;
		c3 = 8;
		c4 = 10;
	}
	var dis = Math.sqrt(catAdy * catAdy + vec[0] * vec[0]);
	var mat = mat4.create();
	var cos = catAdy / dis;
	var sen = vec[0] / dis;
	mat[c1] = cos;
	mat[c2] = sen;
	mat[c3] = -sen;
	mat[c4] = cos;
	var vecRot = vec3.create();
	vec3.transformMat4(vecRot, vec, mat);
	return vecRot;
};

/*
 * Montania Rusa
 */
function MontaniaRusa() {
	ComplexModel.call(this);

    var puntosControl = [
        [0,0,0], [100,0,200], [200,70,200], [300,0,200], 
        // [40,0,0], [50,10,0], [60,20,0], [70,0,0], 
        // [400,100,0], [200,20,0], [100,20,0], [50,20,0],
        // [20,-10,0], [20,-20,0], [20,-50,0], [0,20,0],
        // [0,20,0],[0,20,0],
    ];

	this.vias = new Vias(puntosControl);
	this.carro = new Carro(puntosControl);

	var axis = new Axis();
	axis.scale(30);

	this.addChild(this.vias);
	this.addChild(this.carro);
	this.addChild(axis);
}

MontaniaRusa.prototype = Object.create(ComplexModel.prototype);
MontaniaRusa.prototype.constructor = MontaniaRusa;

MontaniaRusa.prototype.getCarro = function () {
	return this.carro;
};

/*
    Via
*/
function Via( path , ratio, color) {
    this.constructor(path,ratio,color);
}

// Métodos
Via.prototype = (function() {
    var pr = {}; // jshint ignore:line
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( path , ratio, color) {
        PrimitiveModel.prototype.constructor.call(this);

        var tricirculo = new TriCircle(ratio);

        var recorrido = new Path(8);
        recorrido.addStretch(new CubicBSpline(path));
        
        var geometry = new SweptSurface(recorrido, tricirculo);
        geometry.setClosedShapes(false);
        geometry.setClosedEndings(false);

        pu.init.call(this, geometry, new ColoredMaterial(color));
    };

    // Métodos privados

    // Métodos públicos

    return pu;
})();

/*
 * Vias
 */
function Vias(path) {
	ComplexModel.call(this);

	var via = new Via(path ,1.6, Color.GREY);

	this.addChild(via);

}

Vias.prototype = Object.create(ComplexModel.prototype);
Vias.prototype.constructor = Vias;

function Piso() {
	//this.cuerpoRigido;
	//this.groundMaterial;

	var pisoSize = 2000;

	//var material = new ColoredMaterial(Color.FORESTGREEN);
	var material = new TexturedMaterial("images/green-grass-texture.jpg");
	material.setNormalMap("images/green-grass-normalmap.jpg");

	Sprite.call(this, pisoSize, pisoSize, material);

	this.translateZ(-10);

	/*
	// TODO creo que acá es en y = -10
	// Plano del Suelo, ubicado en z = -10
	this.groundMaterial = new CANNON.Material("groundMaterial");
	var groundShape = new CANNON.Plane();
	// masa 0 implica que el cuerpo tiene masa infinita
	this.cuerpoRigido = new CANNON.RigidBody(0, groundShape, this._groundMaterial);
	this.cuerpoRigido.useQuaternion = true;
	this.cuerpoRigido.position.z = ConstantesTanque.ALTURA_PISO;
	*/
}

Piso.prototype = Object.create(Sprite.prototype);
Piso.prototype.constructor = Piso;

/*
Piso.prototype.getCuerpoRigido = function () {
	return this.cuerpoRigido;
};

Piso.prototype.getMaterial = function () {
	return this.groundMaterial;
};
*/

/*
 * Base Sillas voladoras
 */
function Base() {
    PrimitiveModel.prototype.constructor.call(this);

    var torre = new Path(10);
    torre.addStretch(new LinearCurve([
        [15,0], [15,30], [10,40], [10,40], [8.7,55], [8.7,85],
    ]));

    var geometry = new RevolutionSurface(torre, 30);
    geometry.setClosedEndings(false);
    geometry.setCenteredInKernel(false);

    var material = new ColoredMaterial(Color.RED);

    this.init(geometry, material);
}

Base.prototype = Object.create(PrimitiveModel.prototype);

Base.prototype.constructor = Base;

/*
    Silla
*/
function Silla(width) {
	this._base;
	this._respaldo;
	this._width = width;
    this.constructor();
}

// Métodos
Silla.prototype = (function() {
    var pr = {}; // jshint ignore:line
    var pu = Object.create(ComplexModel.prototype);

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        var totalHeight = 50;
        var canioHeight = 40;
        var anguloCanio = 90;
        var subcanioHeight = Math.sqrt(Math.pow(this._width/2,2)+Math.pow(totalHeight - canioHeight,2));
        var anguloSubcanio = Math.acos(this._width/2/subcanioHeight);

        this._base = new Box(this._width,this._width,1, new ColoredMaterial(Color.GREY));
        this._base.rotateZ(Utils.degToRad(-90));
        this._base.translateX(this._width/2 + totalHeight);
        this._base.translateY(this._width/2);

        this._respaldo = new Box(this._width,this._width,1, new ColoredMaterial(Color.GREY));
        this._respaldo.translateY(-totalHeight);

        var canio1 = new Canio(canioHeight);
        canio1.translateY(-canioHeight/2);
		canio1.rotateX(Utils.degToRad(anguloCanio));

        var canio2 = new Canio(subcanioHeight);
        canio2.translateY(-canioHeight - (totalHeight - canioHeight)/2);
        canio2.translateZ(-this._width/4);
		canio2.rotateX(-anguloSubcanio);

        var canio3 = new Canio(subcanioHeight);
        canio3.translateY(-canioHeight - (totalHeight - canioHeight)/2);
        canio3.translateZ(this._width/4);
        canio3.rotateX(anguloSubcanio);

        pu.addChild.call(this, this._base);
        pu.addChild.call(this, this._respaldo);
        pu.addChild.call(this, canio1);
        pu.addChild.call(this, canio2);
        pu.addChild.call(this, canio3);

    };

    // Métodos privados

    // Métodos públicos

    return pu;
})();

/*
 * Sillas voladoras
 */
function SillasVoladoras() {
    this._soporteGiratorio;
    this._base;

    this.constructor();
}

//Metodos
SillasVoladoras.prototype = (function () {
    var pr = {}; // jshint ignore:line
    var pu = Object.create(ComplexModel.prototype);  // extiende ComplexModel

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._base = new Base();
        
        this._soporteGiratorio = new SoporteGiratorio();
        this._soporteGiratorio.translateY(80);

        pu.addChild.call(this, this._base);
        pu.addChild.call(this,  this._soporteGiratorio);
    };

    return pu;
})();

/*
    Soporte
*/
function Soporte() {
    this.constructor();
}

// Métodos
Soporte.prototype = (function() {
    var pr = {}; // jshint ignore:line
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function() {
        PrimitiveModel.prototype.constructor.call(this);

        var side = new Path(10);
        side.addStretch(new LinearCurve([
            [10,0], [60,10], [60,20],
        ]));

        var geometry = new RevolutionSurface(side, 30);
        geometry.setClosedEndings(false);
        geometry.setCenteredInKernel(false);

        var material = new ColoredMaterial(Color.RED);

        pu.init.call(this, geometry, material);
        
    };
    
    return pu;
})();

/*
 * Soporte Giratorio
 */
function SoporteGiratorio() {
    this._soporte;
    this._orientation;

    this.constructor();
}

//Metodos
SoporteGiratorio.prototype = (function () {
    var pr = {}; // jshint ignore:line
    var pu = Object.create(ComplexModel.prototype);  // extiende ComplexModel

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._soporte = new Soporte();

        var techo = new Polygon(new Circle(60), Color.RED);
        techo.translateY(20);
        techo.rotateX(Utils.degToRad(90));

        pu.addChild.call(this, this._soporte);
        pu.addChild.call(this, techo);

        var rotation = 90;
        for(var i=0; i<8; i++) {
            var silla = new Silla(8);
            silla.rotateY(Utils.degToRad(rotation));
            silla.translateZ(50);
            silla.translateY(15);
            silla.rotateX(-Utils.degToRad(15));
            rotation = rotation + 45;
            pu.addChild.call(this, silla);
        }

        this._timePass = 2500;
        this._orientation = 1;

    };

    return pu;
})();

//@override
SoporteGiratorio.prototype.update = function(elapsedTime) {
    ComplexModel.prototype.update.call(this, elapsedTime);
    this.rotateY(Utils.degToRad(elapsedTime/80));
    this.rotateX(Utils.degToRad(this._orientation * elapsedTime/200));
    if(this._timePass >= 5000) {
        this._timePass = 0;
        this._orientation = this._orientation * -1;
    } else {
        this._timePass = this._timePass + elapsedTime;
    }
};

/*
 * Cabina de la vuelta al mundo
 */
function Cabina(velocidadDeGiro, color) {
	ComplexModel.call(this);

	this.velocidadDeGiro = velocidadDeGiro;

	var anchoLargo = 7;
	var espesor = 0.2;

	var materialTecho = new ColoredMaterial(color);
	this.techo = new Box(anchoLargo, espesor, anchoLargo, materialTecho);
	this.techo.translateY(espesor);

	var materialParedesSuperiores = new ColoredMaterial(color);
	var altoParedesSuperiores = 3;
	this.paredesSuperiores = new ParedCabina(espesor, anchoLargo, anchoLargo,
		altoParedesSuperiores, materialParedesSuperiores);
	this.paredesSuperiores.translateY(espesor - (altoParedesSuperiores / 2));
	//this.paredesSuperiores.translateX(-espesor);
	//this.paredesSuperiores.translateZ(espesor);

	var generadorColumna = function (espesor, ancho, alto, color, angulo, posX, posY, posZ) {
		var materialColumna = new ColoredMaterial(color);
		var columna = new ColumnaCabina(espesor, ancho, alto, materialColumna);
		columna.translateZ(posZ);
		columna.translateX(posX);
		columna.translateY(posY);
		columna.rotateY(Utils.degToRad(angulo));
		return columna;
	};
	var anchoColumna = 2;
	var altoColumna = 10;
	var posYColumna = -altoParedesSuperiores - (altoColumna / 2) + espesor;
	var traslacion = anchoLargo / 2 - anchoColumna / 4;

	this.columna1 = generadorColumna(espesor, anchoColumna, altoColumna, color,
		0, -traslacion, posYColumna, -traslacion);

	this.columna2 = generadorColumna(espesor, anchoColumna, altoColumna, color,
		90, -traslacion, posYColumna, traslacion);

	this.columna3 = generadorColumna(espesor, anchoColumna, altoColumna, color,
		-90, traslacion, posYColumna, -traslacion);

	this.columna4 = generadorColumna(espesor, anchoColumna, altoColumna, color,
		180, traslacion, posYColumna, traslacion);

	var materialParedesInferiores = new ColoredMaterial(color);
	var altoParedesInferiores = 6;
	this.paredesInferiores = new ParedCabina(espesor, anchoLargo, anchoLargo,
		altoParedesInferiores, materialParedesInferiores);
	this.paredesInferiores.translateY(espesor - altoParedesSuperiores - altoColumna - (altoParedesInferiores / 2));

	var materialPiso = new ColoredMaterial(color);
	this.piso = new Box(anchoLargo, espesor, anchoLargo, materialPiso);
	this.piso.translateY(espesor * 2 - altoParedesSuperiores - altoColumna - altoParedesInferiores);

	this.addChild(this.techo);
	this.addChild(this.paredesSuperiores);
	this.addChild(this.columna1);
	this.addChild(this.columna2);
	this.addChild(this.columna3);
	this.addChild(this.columna4);
	this.addChild(this.paredesInferiores);
	this.addChild(this.piso);
}

Cabina.prototype = Object.create(ComplexModel.prototype);
Cabina.prototype.constructor = Cabina;

//@override
Cabina.prototype.update = function (elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);
	this.rotateX(Utils.degToRad(-elapsedTime * this.velocidadDeGiro));
};

/*
 * Canio
 */
function Canio(length) {
	PrimitiveModel.call(this);

	var path = [[0,0,0], [0,0,length]];
	var tamanio = 1;
	var forma = new Rectangle(tamanio, tamanio);

	var recorrido = new Path(8);
	recorrido.addStretch(new LinearCurve(path));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(true);

	this.init(geometry, new ColoredMaterial(Color.GREY));
}

Canio.prototype = Object.create(PrimitiveModel.prototype);

Canio.prototype.constructor = Canio;

/*
 * Pared perimetral para la cabina
 */
function ColumnaCabina(espesor, ancho, alto, material) {
	PrimitiveModel.call(this);

	var path = [[ancho, 0, 0], [0, 0, 0], [0, 0, ancho]];
	var forma = new Rectangle(espesor, alto);

	var recorrido = new Path(1);
	recorrido.addStretch(new LinearCurve(path));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(true);

	this.init(geometry, material);
	//this.translateX(ancho/2 - espesor*2);
	//this.translateZ(ancho/2 - espesor*2);
}

ColumnaCabina.prototype = Object.create(PrimitiveModel.prototype);

ColumnaCabina.prototype.constructor = ColumnaCabina;

/*
 * Estructura giratoria de la "Vuelta al mundo".
 */
function EstructuraGiratoria(ancho) {
	ComplexModel.call(this);

	this.canioCentral = new Canio(ancho * 2);
	this.canioCentral.rotateY(Utils.degToRad(90));
	this.addChild(this.canioCentral);

	this.velocidadDeGiro = 1 / 80;
	this.ancho = ancho;

	var canioPerimetro = function (largo, posX, posZ, anguloPoligono, anguloRotacion) {
		var canio = new Canio(largo);
		canio.rotateX(Utils.degToRad(anguloRotacion));
		canio.translateY(posZ);
		canio.translateX(posX);
		canio.rotateX(Utils.degToRad(anguloPoligono / 2));
		canio.translateZ(largo / 2);
		return canio;
	};

	var canioLongitudinal = function (largo, posX, anguloRotacion) {
		var canio = new Canio(largo);
		canio.rotateX(Utils.degToRad(anguloRotacion));
		canio.translateX(posX);
		canio.rotateX(Utils.degToRad(90));
		canio.translateZ(-largo / 2);
		return canio;
	};

	for (var i = 0; i < 12; i++) {
		var angulo = 30;
		var largoCanio = 17;
		var radio = 32;
		var largoCanioTransversal = this.ancho;

		var canioDerecha = canioPerimetro(largoCanio, -largoCanioTransversal / 2,
			radio, angulo, i * angulo);
		this.addChild(canioDerecha);

		var canioLongDerecha = canioLongitudinal(radio, -largoCanioTransversal / 2,
			i * angulo);
		this.addChild(canioLongDerecha);

		var canioIzquierda = canioPerimetro(largoCanio, largoCanioTransversal / 2,
			radio, angulo, i * angulo);
		this.addChild(canioIzquierda);

		var canioLongIzquierda = canioLongitudinal(radio,
			largoCanioTransversal / 2, i * angulo);
		this.addChild(canioLongIzquierda);

		if (i % 2 === 0) {
			var canioTransversal = new Canio(largoCanioTransversal);
			canioTransversal.rotateX(Utils.degToRad(i * angulo));
			canioTransversal.translateY(radio);
			canioTransversal.rotateY(Utils.degToRad(90));
			this.addChild(canioTransversal);

			var color;
			var numCabina = i / 2;
			switch (numCabina) {
			case 1:
				color = Color.BLUE;
				break;
			case 2:
				color = Color.RED;
				break;
			case 3:
				color = Color.GREEN;
				break;
			case 4:
				color = Color.ORANGE;
				break;
			case 5:
				color = Color.PURPLE;
				break;
			default:
				color = Color.YELLOW;
			}

			var cabina = new Cabina(this.velocidadDeGiro, color);
			cabina.rotateX(Utils.degToRad(i * angulo));
			cabina.translateY(radio);
			cabina.rotateX(Utils.degToRad(90 - i * angulo));
			this.addChild(cabina);
		}
	}
}

EstructuraGiratoria.prototype = Object.create(ComplexModel.prototype);
EstructuraGiratoria.prototype.constructor = EstructuraGiratoria;

//@override
EstructuraGiratoria.prototype.update = function (elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);
	this.rotateX(Utils.degToRad(elapsedTime * this.velocidadDeGiro));
};

/*
 * Pared perimetral para la cabina
 */
function ParedCabina(espesor, ancho, largo, alto, material) {
	PrimitiveModel.call(this);

	var path = [[0, 0, 0], [0, 0, ancho], [largo, 0, ancho], [largo, 0, 0], [0, 0, 0]];
	var forma = new Rectangle(espesor, alto);

	var recorrido = new Path(1);
	recorrido.addStretch(new LinearCurve(path));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(true);

	this.init(geometry, material);
	this.translateX(-espesor * 4);
	this.translateZ(-espesor * 4);
}

ParedCabina.prototype = Object.create(PrimitiveModel.prototype);

ParedCabina.prototype.constructor = ParedCabina;

/*
 * Soporte de la Vuelta al mundo
 */
function SoporteLateral() {
	PrimitiveModel.call(this);

	var alto = 65;
	var path = [[0,0,0], [0,0,1]];
	var forma = new Trapezoid(20, 2, alto);

	var recorrido = new Path(2);
	recorrido.addStretch(new LinearCurve(path));

	var geometry = new SweptSurface(recorrido, forma);
	geometry.setClosedShapes(true);
	geometry.setClosedEndings(true);

	this.init(geometry, new ColoredMaterial(Color.GREY));
	this.rotateY(Utils.degToRad(90));
	this.rotateZ(Utils.degToRad(90));
	this.translateY(alto/2);
}

SoporteLateral.prototype = Object.create(PrimitiveModel.prototype);
SoporteLateral.prototype.constructor = SoporteLateral;

/*
 * Vuelta al mundo
 */
function VueltaAlMundo() {
	ComplexModel.call(this);

	var anchoEstructura = 10;
	this.estructuraGiratoria = new EstructuraGiratoria(anchoEstructura);
	this.estructuraGiratoria.translateZ(50);

	var desplazamientoSoporte = anchoEstructura/2 + 2;
	var desplazamientoAlSuelo = -11;
	this.soporteDerecho = new SoporteLateral();
	this.soporteDerecho.translateZ(-desplazamientoSoporte);
	this.soporteDerecho.translateY(desplazamientoAlSuelo);

	this.soporteIzquierdo = new SoporteLateral();
	this.soporteIzquierdo.translateZ(desplazamientoSoporte);
	this.soporteIzquierdo.translateY(desplazamientoAlSuelo);

	this.addChild(this.estructuraGiratoria);
	this.addChild(this.soporteDerecho);
	this.addChild(this.soporteIzquierdo);
}

VueltaAlMundo.prototype = Object.create(ComplexModel.prototype);
VueltaAlMundo.prototype.constructor = VueltaAlMundo;

function CamaraOrbital(width, height, eye, target, up) {
	this.camara = new PerspectiveCamera(width, height);
	this.camara.setUp(up[0], up[1], up[2]);
	this.camara.setPosition(eye[0], eye[1], eye[2]);
	this.camara.setTarget(target[0], target[1], target[2]);

	this.factorRotacion = 5;
	this.factorZoom = 1.05;
}

CamaraOrbital.prototype.signo = function (n) {
	var res = 0;

	if (n > 0) {
		res = 1;
	} else if (n < 0) {
		res = -1;
	}

	return res;
};

CamaraOrbital.prototype.zoomIn = function () {
	this.camara.scale(this.factorZoom);
};

CamaraOrbital.prototype.zoomOut = function () {
	this.camara.scale(1 / this.factorZoom);
};

CamaraOrbital.prototype.rotate = function (rotateY, rotateZ) {
	this.camara.rotateZ(Utils.degToRad(rotateY / this.factorRotacion));
	this.camara.rotateY(Utils.degToRad(rotateZ / this.factorRotacion));
};

CamaraOrbital.prototype.getPerspectiveCamera = function () {
	return this.camara;
};

function CamaraPrimeraPersona(width, height, eye, target, up) {
	this.targetInicial = target;
	this.eyeInicial = eye;
	this.camara = new PerspectiveCamera(width, height);
	this.camara.setUp(up[0], up[1], up[2]);
	this.camara.setPosition(eye[0], eye[1], eye[2]);
	this.camara.setTarget(target[0], target[1], target[2]);

	this.objetoFicticio = new Transformable();
	this.objetoFicticio.setPosition(eye[0], eye[1], eye[2]);
}

CamaraPrimeraPersona.prototype.transformarEye = function (matriz) {
	var newEye = vec3.create();
	vec3.transformMat4(newEye, this.eyeInicial, matriz);
	return newEye;
};

CamaraPrimeraPersona.prototype.transformarTarget = function (matriz) {
	var newTarget = vec3.create();
	vec3.transformMat4(newTarget, this.targetInicial, matriz);
	return newTarget;
};

CamaraPrimeraPersona.prototype.update = function () {
	var matrizTransformacion = this.objetoFicticio.objectMatrix;
	var newEye = this.transformarEye(matrizTransformacion);
	var newTarget = this.transformarTarget(matrizTransformacion);
	this.camara.setPosition(newEye[0], newEye[1], newEye[2]);
	this.camara.setTarget(newTarget[0], newTarget[1], newTarget[2]);
};

CamaraPrimeraPersona.prototype.rotate = function (rotateY, rotateZ) {
	this.objetoFicticio.rotateZ(-Utils.degToRad(rotateY / 5));
	this.objetoFicticio.rotateY(Utils.degToRad(rotateZ / 5));
	this.update(this);
};

CamaraPrimeraPersona.prototype.trasladarDerecha = function (n) {
	this.objetoFicticio.translate(0, -n, 0);
	this.update();
};

CamaraPrimeraPersona.prototype.trasladarIzquierda = function (n) {
	this.objetoFicticio.translate(0, n, 0);
	this.update();
};

CamaraPrimeraPersona.prototype.trasladarAdelante = function (n) {
	this.objetoFicticio.translate(n, 0, 0);
	this.update();
};

CamaraPrimeraPersona.prototype.trasladarAtras = function (n) {
	this.objetoFicticio.translate(-n, 0, 0);
	this.update();
};

CamaraPrimeraPersona.prototype.getPerspectiveCamera = function () {
	return this.camara;
};

function CamaraSeguimiento(objetoASeguir, width, height, eye, target, up) {
	this.objetoASeguir = objetoASeguir;
	this.targetInicial = target;
	this.eyeInicial = eye;
	this.rotateY = 0;
	this.rotateZ = 0;
	this.camara = new PerspectiveCamera(width, height);
	this.camara.setUp(up[0], up[1], up[2]);
	this.camara.setPosition(eye[0], eye[1], eye[2]);
	this.camara.setTarget(target[0], target[1], target[2]);
}

// Metodos privados

CamaraSeguimiento.prototype.transformarEye = function (matriz) {
	var newEye = vec3.create();
	vec3.transformMat4(newEye, this.eyeInicial, matriz);
	return newEye;
};

CamaraSeguimiento.prototype.transformarTarget = function (matriz) {
	var newTarget = vec3.create();
	vec3.transformMat4(newTarget, this.targetInicial, matriz);
	return newTarget;
};

CamaraSeguimiento.prototype.doRotate = function () {
	this.camara.rotateZ(Utils.degToRad(this.rotateY / this.factorRotacion));
	this.camara.rotateY(Utils.degToRad(this.rotateZ / this.factorRotacion));
};

// Métodos públicos

CamaraSeguimiento.prototype.rotate = function (rotateY, rotateZ) {
	this.rotateY = rotateY;
	this.rotateZ = rotateZ;
};

CamaraSeguimiento.prototype.update = function () {
	var matrizTransformacion = this.objetoASeguir.objectMatrix;
	var newEye = this.transformarEye(matrizTransformacion);
	var newTarget = this.transformarTarget(matrizTransformacion);
	this.camara.setPosition(newEye[0], newEye[1], newEye[2]);
	this.camara.setTarget(newTarget[0], newTarget[1], newTarget[2]);
	//	 this.doRotate();  TODO que permita rotar
	this.rotateY = 0;
	this.rotateZ = 0;
};

CamaraSeguimiento.prototype.getPerspectiveCamera = function () {
	return this.camara;
};

var lastTime = 0; // Tiempo de la última vez que se ejecutó la animación
var elapTime = 0;
var minTime = 30;
var frameTime = 0;
var frameCount = 0;
var fps;

var renderer, escena;

var piso, fondo, vueltaAlMundo, sillasVoladoras, montaniaRusa;

var camara, camaraOrbital, camaraPrimeraPersona, camaraSeguimiento;

var ambientColor, directionalColor, directionalPosition;
var spotlightColor, spotlightPosition, spotlightDirection;

function start() { // jshint ignore:line
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

	vueltaAlMundo = new VueltaAlMundo();
	vueltaAlMundo.translateX(100);

	sillasVoladoras = new SillasVoladoras();
	sillasVoladoras.translateY(-100);
	sillasVoladoras.translateZ(-10);
	sillasVoladoras.rotateX(Utils.degToRad(90));

	montaniaRusa = new MontaniaRusa();
	montaniaRusa.translateX(-150);
	montaniaRusa.translateY(200);
	montaniaRusa.translateZ(50);

	escena = new Scene();

	// habilita la iluminacion
	ambientColor = 0.8;
	directionalColor = 0.4;
	spotlightColor = 0.0;

	directionalPosition = [-600, 200, 400];
	spotlightPosition = [10.0, 0.0, 0.0];
	spotlightDirection = [1.0, 0.0, -0.7]; // TODO deberia ser -1,0,0

	escena.setAuto(montaniaRusa.getCarro());
	escena.setLightSources(ambientColor, directionalColor, directionalPosition, spotlightColor, spotlightPosition, spotlightDirection);

	// AGREGAR OBJETOS A LA ESCENA

	escena.add(piso);
	escena.add(fondo);
	escena.add(vueltaAlMundo);
	escena.add(sillasVoladoras);
	escena.add(montaniaRusa);

	var eyeOrbital = vec3.fromValues(0, 100, 20);
	var targetOrbital = vec3.fromValues(0, 0, -10);
	camaraOrbital = new CamaraOrbital(w, h, eyeOrbital, targetOrbital, up);
	camara = camaraOrbital;

	var eyePP = vec3.fromValues(0, 0, 6);
	var targetPP = vec3.fromValues(3, 0, 6);
	camaraPrimeraPersona = new CamaraPrimeraPersona(w, h, eyePP, targetPP, up);

	var eyeSeguimiento = vec3.fromValues(0, 0, 10);
	var targetSeguimiento = vec3.fromValues(20, 0, 0);
	camaraSeguimiento = new CamaraSeguimiento(montaniaRusa.getCarro(), w, h, eyeSeguimiento, targetSeguimiento, up);
}

function listenToKeyboard() {
	// TODO: dado que Keyboard es estático sería bueno poner el
	// comportamiento de a cada objeto en los metodos update()
	// correspondientes y no en esta funcion

	// camaras
	if (Keyboard.isKeyPressed(Keyboard.C, true)) {
		if (camara === camaraOrbital) {
			camara = camaraPrimeraPersona;
		} else if (camara === camaraPrimeraPersona) {
			camara = camaraSeguimiento;
		} else {
			camara = camaraOrbital;
		}
	}

	var camaraVel = 1;
	if (Keyboard.isKeyPressed(Keyboard.W)) {
		camaraPrimeraPersona.trasladarAdelante(camaraVel);
	} else if (Keyboard.isKeyPressed(Keyboard.S)) {
		camaraPrimeraPersona.trasladarAtras(camaraVel);
	}
	if (Keyboard.isKeyPressed(Keyboard.D)) {
		camaraPrimeraPersona.trasladarDerecha(camaraVel);
	} else if (Keyboard.isKeyPressed(Keyboard.A)) {
		camaraPrimeraPersona.trasladarIzquierda(camaraVel);
	}
}

function listenToMouse() {
	if (Mouse.isButtonPressed(Mouse.LEFT)) {
		var speed = 10;

		var deltaX = Mouse.getDeltaX();
		var deltaY = Mouse.getDeltaY();

		if (camara === camaraPrimeraPersona) {
			camara.rotate(deltaX * speed, 0);
		} else {
			camara.rotate(deltaX * speed, deltaY * speed);
		}
	}

	if (camara == camaraOrbital && Mouse.isWheelMoving()) {
		if (Mouse.getWheelDelta() < 0) {
			camara.zoomOut();
		} else {
			camara.zoomIn();
		}
	}
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

	var time = elapsedTime();

	elapTime += time;
	frameTime += time;

	if (frameTime < minTime) {
		return;
	} else {
		time = frameTime;
		frameTime = 0;
	}

	frameCount++;

	if(elapTime >= 1000) {
		fps = frameCount;
		frameCount = 0;
		elapTime -= 1000;

		document.getElementById('test').innerHTML = fps;
	}

	renderer.clear();

	listenToKeyboard();
	listenToMouse();

	escena.update(time); // actualiza todos los modelos
	if (camara === camaraSeguimiento) {
		camaraSeguimiento.update();
	}
	renderer.render(escena, camara.getPerspectiveCamera());
}
