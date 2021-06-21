'use strinct';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const { allBalanzaPort, openPort, openPortNew, closePort } = require('./readport');
const { writeDataConfig } = require('./helperfunc');

// initialization
dotenv.config();
const serve = new express();

const thePort = process.env.PORTHTTP || 3000;

serve.use(cors());
serve.use(express.json());
serve.use(express.urlencoded({ extended: true }));

let _sendData = undefined;
let _fechaTomaData = new Date();

const ISDEV = process.env.NODE_ENV || null;
const onData = (data) => {
  try {
    const dateNow = new Date();
    const dateString =
      ('0' + dateNow.getHours()).slice(-2) +
      ':' +
      ('0' + dateNow.getMinutes()).slice(-2) +
      ':' +
      ('0' + dateNow.getSeconds()).slice(-2);

    let reciveData = data.toString();
    reciveData = reciveData.replace(/(\r\n|\n|\r|\=)/gm, '');
    const valor = reciveData.slice(-6);
    _sendData = { hora: dateString, valor };
    _fechaTomaData = new Date();
    if (ISDEV) console.log(_sendData);
  } catch (error) {
    _sendData = {};
  }
};

serve.get('/api/read', (req, res) => {
  let codeStatus = 409;
  let statusOk = false;
  const _noSendData = { message: 'data not found.' };
  try {
    const fechaActual = new Date();

    const resta = fechaActual.getTime() - _fechaTomaData.getTime();
    if (resta > 1800) {
      _sendData = _noSendData;
    } else {
      codeStatus = 200;
      statusOk = true;
    }

    res.status(codeStatus).json({ statusOk, ..._sendData });
  } catch (error) {
    res.status(codeStatus).json({ statusOk, ..._noSendData });
  }
});

serve.get('/api/portwrite', async (req, res) => {
  let statusOk = false;
  let codeStatus = 409;

  const BALANZAPORTCOM = req.query.BALANZAPORTCOM;
  const BALANZABAUDIOS = req.query.BALANZABAUDIOS;

  console.log(BALANZAPORTCOM, BALANZABAUDIOS);
  let _noSendData = { message: 'data not found.' };

  try {
    await writeDataConfig('config.json', {
      'BALANZAPORTCOM': BALANZAPORTCOM,
      'BALANZABAUDIOS': BALANZABAUDIOS,
    });
    codeStatus = 200;
    statusOk = true;
    res
      .status(codeStatus)
      .json({ statusOk, 'port': BALANZAPORTCOM, 'baudio': BALANZABAUDIOS });
  } catch (error) {
    res.status(codeStatus).json({ statusOk, ..._noSendData });
  }
});

serve.get('/api/ports', (req, res) => {
  const iplocal = 'xxxxx';
  try {
    const portAll = allBalanzaPort();
    portAll.then((item) => {
      res.status(200).json({ localIP: iplocal, portAll: item });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/api/open', async (req, res) => {
  var resultPort = {};
  try {
    const { portName, baudRate } = req.query;

    if (portName !== undefined) {
      resultPort = await openPortNew(portName, parseInt(baudRate, 10), onData);
    } else {
      resultPort = await openPort(onData);
    }
    // console.log(resultPort);
    res.status(201).json(resultPort);
  } catch (error) {
    res.status(500).json({ statusOk: false, message: error });
  }
});

serve.get('/api/close', (req, res) => {
  try {
    const resultPort = closePort();
    console.log(resultPort);
    res.status(201).json(resultPort);
  } catch (error) {
    res.status(500).json({ statusOk: false, message: error });
  }
});

serve.use(function (req, res, next) {
  res.status(404).send('Lo siento no encuentro la ruta..!');
});

serve.listen(thePort, async () => {
  await openPort(onData);
  console.log(`Lector / Puerto:${thePort}`);
});
