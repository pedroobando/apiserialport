# apiserialport

## Description

Aplicacion con el fin de leer el puerto serial (RS232) de una balanza, sus datos son capturados para luego ser mostrados en un servidor web mediante http, con el comando GET.

El objetivo es crear un contenedor en docker que encapsule la aplicacion y este activo siempre desde el inicio del computador o equipo donde se encuentre alojado. El contenedor es linux debian y nodejs, tambien las respectivas librerias que abriran el puerto serial o usb.

## Archivo .env

```bash
# Valores internos de la aplicacion dentro del contenedor

# Numero del puerto interno => http:localhost:4000
  PORT = 4000

# nombre del serial / usb, que leera la aplicacion.
  BALANZAPORTCOM = '/dev/ttyACM0'

# velocidad de transmicion, del equipo
  BALANZABAUDIOS = 9600
```

## Guia Docker

```bash
# Guia de creacion del contenedor con docker. Con los siguientes comandas.

#-1. Crear la imagen
# En este caso la imagen se llamara readbalanzaimg
  $ docker build -t readbalanzaimg .


# En este seccion definiremos loas parametros externos.
#-2. Crear el contenedor
# -it: modo interactivo
# -d: modo deployment
# --restart always: reiniciara siempre.
# --name readbalanza, indica el nombre del contenedor
# --privileged -v: puerto_serial_externo:puerto_serial_interno
# -p 4001:4000: puerto_externo_expondra_el_servicio: puerto_interno_donde_se_ejecuta
# readbalanzaimg, es el nombre de la imagen a la cual primero creamos, de la cual se creara el contenedor.


$ docker run --name readbalanza -it -d --restart always --privileged -v /dev/ttyACM0:/dev/ttyACM0 -p 4001:4000 readbalanzaimg


# Guida de node Docker
  https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Entrar a un contenedor
  $ docker exec -i -t contenedorId /bin/bash #
  $ docker exec -i -t contenedorId /bin/sh # <= alpine

# Extraer la base datos del contenedor
  $ docker cp contenedorId:/app/logisticadb.sqlite  .

# Copiar archivo al contenedor
  $ docker cp nombredelarchivo  contenedorId:/rutadestino
```

## kill process active

```bash
# Primero, querrá saber qué proceso está utilizando el puerto 3000
$ sudo lsof -i :4000

# Esto enumerará todos los PID que escuchan en este puerto, una vez que tenga el PID puede terminarlo:
$ kill -9 {PID}
```

## Guia de SerialPort

```bash
# Muestra los puertos USB
  $ dmesg | grep tty

# Activa los permisos para lectura puerto
  $ sudo chmod a+rw /dev/ttyACM0
```

## License

Pedro Obando is [MIT licensed](LICENSE).
