# APISERIALPORT

## Description

Aplicacion con el fin de leer el puerto serial (RS232) de una balanza, sus datos son capturados para luego ser mostrados en un servidor web mediante http, con el comando GET.

## Cambio del puerto del servidor web

```bash
# En el archivo .env, existe variable llamada PORTHTTP

  PORTHTTP = 3010
```

## Instalacion de la aplicacion

### Es montada en memoria con [pm2](https://pm2.keymetrics.io/)

```bash
  pm2 start src/index.js --name serialport
  pm2 save --force
```

### Al reiniciar el equipo (windows) y desea ejecutarla en memoria de nuevo

```bash
  pm2 resurrect
```

### Desintalar la aplicacion o quitar de memoria.

```bash
  pm2 delete serialport
  pm2 save --force
```

Nota: Mayor informacion de [PM2 en su apartado o documentacion](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).

## Salida Json o Metodos

### Abrir un puerto especifico

Todos los metodos son ejecutado, mediante el comando GET

```bash
  http://172.1.1.0:3010/api/open?portName=COM1&baudRate=9600

  # Al abrir un puerto especifico este es guardado automaticamente y la proxima llamada del metodo, no hace falta especificarlo.
```

### Abrir un puerto guardado

```bash
  http://172.1.1.0:3010/api/open
```

### Lectura los datos

```bash
  http:[IP]/api/read

  http://172.1.1.0:3010/api/read

  # Valor de salida un JSON con el siguiente formato:

  # Si la peticion tiene exito o el puerto seleccionado contiene data, envia un codigo 200 y el siguiente json.

  {
  "statusOk": true,
  "hora": "16:52:33",
  "valor": "1291.57"
  }

  # Si la peticion tiene falla o el puerto seleccionado no contiene data, envia un codigo 409 y el siguiente json.

  {
  "statusOk": false,
  "msg": "data not found."
  }
```

### Cerrar puerto

```bash
  http://172.1.1.0:3010/api/close

  # Cierra automaticamente el puerto guardado o puerto activo si lo ubiese.
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


$ docker run --name readbalanza -it -d --restart always --privileged -v /dev/ttyACM0:/dev/ttyACM0 -p 3010:3010 readbalanzaimg


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
