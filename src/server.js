const express = require('express');

const bodyParser = require('body-parser');
const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');
const path = require('path');

const dotenv = require('dotenv');
const cors = require('cors');
const pjson = require('../package.json');

const { readDataConfig, writeDataConfig } = require('./helperfunc');

let _sendData = undefined;

// initialization
const serve = express();
dotenv.config();

const valoresConfigJson = readDataConfig('config.json');
const thePort = valoresConfigJson.PORTHTTP;

// const thePort = process.env.PORT || 8080;
const rutaRaizStatic = path.join(__dirname, './html');

serve.use(cors());
serve.use(bodyParser.json());
serve.use(bodyParser.urlencoded({ extended: true }));

// serve.use(express.static('./html'));

// serve.use('/', require('./routes'));

const onErrorOpenPort = (messageErr) => {
  serve.set('ErrorPort', 'Asss');
  // console.log(`Error abriendo puerto ${messageErr}`);
};

const baudRate = parseInt(valoresConfigJson.BALANZABAUDIOS);
const portName = valoresConfigJson.BALANZAPORTCOM;
const puertoSerial = new serialPort(portName, { baudRate }, onErrorOpenPort);
// const lecturaPuerto = puertoSerial.pipe(new readLineSerial());

try {
  // var stdin = process.openStdin();
  // stdin.addListener('data', function (d) {
  //   puertoSerial.write(d.toString().trim() + '\n');
  // });
  puertoSerial.on('open', onOpenPort);
  // lecturaPuerto.on('data', onData);
  // lecturaPuerto.on('error', (err) => {
  //   console.log('Error: porno ', err.message);
  // });
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

    if (reciveData.slice(-2) === 'KG') {
      valorPeso = reciveData;
    }

    if (reciveData.slice(0, 1) === 'S') {
      valorEstable = reciveData;
      _sendData = { hora: dateString, valorPeso, valorEstable };

      // const sendData = { hora: dateString, valorPeso, valorEstable };
      // serve.locals.sendData = sendData;
      // console.log(_sendData);
    }
  } catch (error) {
    console.error(error);
  }
}

// routes

serve.get('/read', async (req, res) => {
  try {
    await puertoSerial.write('W' + '\n');
    setTimeout(() => {
      res.status(200).json(_sendData);
    }, 100);

    // const { hora, valorPeso, valorEstable } = req.app.locals.sendData;
    // const sendData = {
    //   apps: pjson.name,
    //   version: pjson.version,
    //   hora,
    //   valorPeso,
    //   valorEstable,
    // };
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.post('/configport', (req, res) => {
  try {
    writeDataConfig('config.json', req.body);
    res.status(200).json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/config.json', (req, res) => {
  try {
    const readDataNew = readDataConfig('config.json');
    res.status(200).json(readDataNew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.use('/', express.static(rutaRaizStatic));

serve.use(function (req, res, next) {
  res.status(404).send('Lo siento no encuentro la ruta..!');
});

module.exports = { serve, thePort };
