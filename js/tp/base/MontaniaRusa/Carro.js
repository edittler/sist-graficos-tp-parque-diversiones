/*
 * Carro de la Montania Rusa
 */
function Carro(path) {
	ComplexModel.call(this);

	this.curva = new CubicBSpline(path);
	this.recorrido = new Path(8);
	this.recorrido.addStretch(this.curva);

	var punto = this.curva.pointAt(4, 3);

	var material = new ColoredMaterial(Color.RED);
	var ancho = 5;
	var largo = 10
	var alto = 5;
	this.caja = new Box(ancho, alto, largo, material);

	this.axis = new Axis();
	this.axis.scale(10);

	this.addChild(this.caja);
	this.addChild(this.axis);

	this.frame = 0;
	this.velocidad = 0.01;
	this.distanciaRecorrida = 0;
}

Carro.prototype = Object.create(ComplexModel.prototype);
Carro.prototype.constructor = Carro;

//@override
Carro.prototype.update = function (elapsedTime) {
	ComplexModel.prototype.update.call(this, elapsedTime);
	//this.translateX(elapsedTime * this.velocidad);

	//posVec,tanVec,nrmVec,binVec

	var alfa = this.frame / 100;
	var beta = alfa * 4;

	// calculo posicion sobre la curva
	//var pos = vec3.create();
	this.distanciaRecorrida += (elapsedTime / 100) * this.velocidad;
	var point = this.curva.pointAt(this.distanciaRecorrida, 1);
	var pos = vec3.fromValues(point[0],point[1],point[2]);
	//vec3.set(pos, 40 * Math.sin(alfa), 10 * Math.sin(beta), 40 * Math.cos(alfa));

	// calculo tangente de la curva
	var tan = vec3.create();
	vec3.set(tan, 1 * Math.sin(alfa + Math.PI / 2), 1 * Math.cos(alfa + Math.PI / 2), 1 * Math.sin(beta + Math.PI / 2));
	vec3.normalize(tan, tan);

	// defino el vector UP
	var UP = vec3.fromValues(0, 1, 0);

	//bin = UP x tan (producto vectorial)
	var bin = vec3.create();
	vec3.cross(bin, UP, tan);

	//nrm = tan x bin
	var nrm = vec3.create();
	vec3.cross(nrm, tan, bin);

	// m1 = traslación a POS
	var m1 = mat4.create();
	mat4.translate(m1, m1, pos);

	// m2 = rotacion segun ejes tan,nrm,bin   (defino un cambio de base)
	var m2 = mat4.create();
	//m2.makeBasis(tan, nrm, bin);
	var tan4 = vec4.fromValues(tan[0], tan[1], tan[2], 0.0);
	var nrm4 = vec4.fromValues(nrm[0], nrm[1], nrm[2], 0.0);
	var bin4 = vec4.fromValues(bin[0], bin[1], bin[2], 0.0);
	// TODO: Armar la matriz de cambio de base.
	mat4.multiply(m1, m1, m2); // m1 = m1 * m2

	//axisHelper.matrixAutoUpdate = false;
	//axisHelper.matrix = m1;
	this.caja.applyTransformationMatrix(m1);
	this.axis.applyTransformationMatrix(m1);

	/*
	sphere1.position.copy(pos);
		
	var v1=new THREE.Vector3();
	v1.copy(tan);
	v1.multiplyScalar(10);
	v1.add(pos);
	sphereX.position.copy(v1);

	v1.copy(nrm);
	v1.multiplyScalar(10);
	v1.add(pos);
	sphereY.position.copy(v1);


	v1.copy(bin);
	v1.multiplyScalar(10);
	v1.add(pos);
	sphereZ.position.copy(v1);
	*/

	//trazar(pos);

	this.frame++;
};
