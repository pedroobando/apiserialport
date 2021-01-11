const express = require('express');
const { json } = require('express');
const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');
const readBuffer = require('@serialport/stream');

const dotenv = require('dotenv');
const cors = require('cors');
const pjson = require('../package.json');
let _sendData = undefined;

// initialization
const serve = express();
dotenv.config();

const thePort = process.env.PORT || 8080;

serve.use(cors());
serve.use(json());

const baudRate = parseInt(process.env.BALANZABAUDIOS, 10) || 2400;
const portName = process.env.BALANZAPORTCOM || 'COM1'; // "/dev/ttyS0","/dev/ttyACM0", "COM1", "COM2"
const puertoSerial = new serialPort(portName, {
  baudRate: 9600,
  parity: 'none',
  data: 8,
  stopBits: 1,
});
const lecturaPuerto = puertoSerial.pipe(new readLineSerial());

try {
  var stdin = process.openStdin();

  lecturaPuerto.on('open', onOpenPort);
  lecturaPuerto.on('data', onData);
  lecturaPuerto.on('error', (err) => {
    console.log('Error: ', err.message);
  });
} catch (error) {
  console.error(`Error lectura ${error}, Equipo: ${portName}, baudRate: ${baudRate}`);
}

function onOpenPort() {
  try {
    console.log(`Puerto conectado: ${portName}`);
  } catch (error) {
    console.error(`error apertura ${error}`);
  }
}

let valorPeso = '';
let valorEstable = '';

function onData(data) {
  // console.log(data.toString());
  try {
    const dateNow = new Date();
    const dateString =
      ('0' + dateNow.getHours()).slice(-2) +
      ':' +
      ('0' + dateNow.getMinutes()).slice(-2) +
      ':' +
      ('0' + dateNow.getSeconds()).slice(-2);

    // const horaActual = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
    let reciveData = data.toString();
    reciveData = reciveData.replace(/(\r\n|\n|\r|\=)/gm, '');

    const valorAbsoluto = parseFloat(reciveData.slice(-7).replace('.', ''));
    _sendData = {
      hora: dateString,
      valorPeso: reciveData.slice(-7) + 'KG',
      valorAbsoluto,
    };
    console.log(_sendData);
  } catch (error) {
    console.error(error);
  }
}

serve.get('/read', (req, res) => {
  try {
    res.status(200).json(_sendData);
    console.log(_sendData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.use(function (req, res, next) {
  res.status(404).send('Lo siento no encuentro la ruta..!');
});

module.exports = { serve, thePort };
