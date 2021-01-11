const express = require('express');
const { json } = require('express');
const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');

const dotenv = require('dotenv');
const cors = require('cors');

// initialization
const serve = express();
dotenv.config();

const thePort = process.env.PORT || 8080;

serve.use(cors());
serve.use(json());

// serve.use(express.static('./html'));

serve.use('/', require('./routes'));

const baudRate = parseInt(process.env.BALANZABAUDIOS, 10) || 2400;
const portName = process.env.BALANZAPORTCOM || 'COM1'; // "/dev/ttyS0","/dev/ttyACM0", "COM1", "COM2"
const puertoSerial = new serialPort(portName, { baudRate });

const lecturaPuerto = puertoSerial.pipe(new readLineSerial());
try {
  lecturaPuerto.on('open', onOpenPort);
  lecturaPuerto.on('data', onData);
  // lecturaPuerto.on('error', (err) => {
  //   console.log(`Error: - ${err.message}`);
  // });
} catch (error) {
  console.error(`Error lectura ${error}, Equipo: ${portName}, baudRate: ${baudRate}`);
}

function onOpenPort() {
  try {
    console.log('open');
    console.log(`Puerto conectado: ${portName}`);
  } catch (error) {
    console.error(`error apertura ${error}`);
  }
}

let valorPeso = '';
let valorEstable = '';

function onData(data) {
  try {
    const dateNow = new Date();
    const horaActual =
      pad(dateNow.getHours(), 2) +
      ':' +
      pad(dateNow.getMinutes(), 2) +
      ':' +
      pad(dateNow.getSeconds(), 2);

    let reciveData = data.toString();
    reciveData = reciveData.replace(/(\r\n|\n|\r|\=)/gm, '');

    // console.log(reciveData);

    if (reciveData.slice(-2) === 'KG') {
      valorPeso = reciveData;
    }

    if (reciveData.slice(0, 1) === 'S') {
      valorEstable = reciveData;

      const sendData = { hora: horaActual, valorPeso, valorEstable };
      serve.locals.sendData = sendData;
      console.log(sendData);
    }

    // }
    // io.emit('sendTara', sendData);
  } catch (error) {
    console.error(error);
  }
}

function pad(num, size) {
  var s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

// io.on('connection', (socket) => {
//   if (process.env.AMBIENT == 'DEV') {
//     console.log('Usuario Conectado');
//   }
// });

module.exports = { serve, thePort };
