const express = require('express');
const dotenv = require('dotenv');
const internalIp = require('internal-ip');
const cors = require('cors');

const {
  allBalanzaPort,
  // readingData,
  openPort,
  openPortNew,
  closePort,
} = require('./readport');
const { writeDataConfig } = require('./helperfunc');

// initialization
dotenv.config();
const serve = new express();

const thePort = process.env.PORTHTTP || 3000;

// const rutaRaizStatic = path.join(__dirname, './html');
// const rutaStaticCss = path.join(__dirname, './public');

serve.use(cors());
serve.use(express.json());
serve.use(express.urlencoded({ extended: true }));

// serve.set('views', __dirname + '/views');
// serve.set('view engine', 'jsx');
// // var options = { beautify: true };
// serve.engine('jsx', require('express-react-views').createEngine({ beautify: true }));

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

// routes
// serve.use('/public', express.static(rutaStaticCss));

// serve.get('/', (req, res) => {
//   const iplocal = internalIp.v4.sync();
//   try {
//     const { selectport } = req.query;
//     const initialState = readingData();

//     if (selectport !== undefined) initialState.BALANZAPORTCOM = selectport;
//     res.render('home', { initialState, iplocal });
//   } catch (error) {
//     console.log(error);
//     res.redirect('/?selectport=null');
//   }
// });

// serve.post('/', async (req, res) => {
//   try {
//     const { BALANZABAUDIOS, BALANZAPORTCOM } = req.body;
//     _sendData = { message: 'data not found.' };
//     resultPort = await openPortNew(BALANZAPORTCOM, parseInt(BALANZABAUDIOS, 10), onData);
//     res.redirect(req.get('referer'));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

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
  const iplocal = internalIp.v4.sync();
  try {
    const portAll = allBalanzaPort();
    portAll.then((item) => {
      // res.setHeader('Content-Type', 'text/event-stream');
      // res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ localIP: internalIp.v4.sync(), portAll: item });
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

const start = async () => {
  await openPort(onData);
};

start();

module.exports = { serve, thePort, start };
