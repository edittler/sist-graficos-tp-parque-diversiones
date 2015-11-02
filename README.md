# TP Parque de Diversiones
Trabajo práctico grupal para la materia 66.71 Sistemas Gráficos de FIUBA

## Configuración del ambiente
1. Instalar nodejs. Instalación recomendada desde el gestor de paquetes, agregando los paquetes oficiales: https://nodejs.org/en/download/package-manager/

2. Instalar Grunt-CLI ejecutando el comando `sudo npm install -g grunt-cli`

3. Posicionarse en el directorio del proyecto e instalar las dependencias de nodejs ejecutando el comando `npm install`.

## Tareas automatizadas
+ `grunt dev` Junta los archivos JS en 2 archivos, levanta un server para acceder al sitio desde `localhost:8000` y "escucha" cambios realizados para recompilar los archivos y actualizar el sitio abierto en el navegador
+ `grunt build` Genera el sitio con los archivos js unidos y reducidos, almacenando todo en el directorio `build`. Esto sería para generar el sitio a entregar.
