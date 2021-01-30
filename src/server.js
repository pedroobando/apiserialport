const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const internalIp = require('internal-ip');
const cors = require('cors');

const {
  puertoSerialExp,
  reconnect,
  allBalanzaPort,
  settingData,
  readingData,
} = require('./readport');

// initialization
dotenv.config();
const serve = new express();

const thePort = process.env.PORTHTTP || 3000;

// const rutaRaizStatic = path.join(__dirname, './html');
const rutaStaticCss = path.join(__dirname, './public');

serve.use(cors());
serve.use(bodyParser.json());
serve.use(bodyParser.urlencoded({ extended: true }));

serve.set('views', __dirname + '/views');
serve.set('view engine', 'jsx');
var options = { beautify: true };
serve.engine('jsx', require('express-react-views').createEngine(options));

let _sendData = undefined;
let _fechaTomaData = new Date();

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
    // console.log(reciveData);
    const valor = reciveData.slice(-6);
    _sendData = { hora: dateString, valor };
    _fechaTomaData = new Date();
    // console.log(_sendData);
  } catch (error) {
    _sendData = {};
  }
};

// routes
serve.use('/public', express.static(rutaStaticCss));

serve.get('/', (req, res) => {
  // const iplocal = internalIp.v4.sync();
  try {
    const { selectport } = req.query;
    const initialState = readingData();
    console.log(selectport);

    if (selectport !== undefined) initialState.BALANZAPORTCOM = selectport;

    res.render('home', { initialState, iplocal: 22 });
  } catch (error) {
    console.log(error);
    res.redirect('/?selectport=null');
  }
});

serve.post('/', async (req, res) => {
  try {
    const { BALANZABAUDIOS, BALANZAPORTCOM } = req.body;
    await settingData(BALANZAPORTCOM, BALANZABAUDIOS);
    await reconnect(onData);

    res.redirect(req.get('referer'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/read', (req, res) => {
  let codeStatus = 409;
  let statusOk = false;
  const _noSendData = { msg: 'data not found.' };
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

serve.get('/puertos', (req, res) => {
  const iplocal = internalIp.v4.sync();
  try {
    const portAll = allBalanzaPort();
    portAll.then((item) => {
      res.status(200).render('puertos', { portAll: item, iplocal });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.use(function (req, res, next) {
  res.status(404).send('Lo siento no encuentro la ruta..!');
});

// const serialPort = require('serialport');
// const readLineSerial = require('@serialport/parser-readline');

// const { readDataConfig, writeDataConfig } = require('./helperfunc');

// const nameFileConfig = './config.json';

// let valoresConfigJson = undefined;
// let portBaudRate = undefined;
// let portName = undefined;
// let puertoSerial = undefined; //new serialPort('COM1', { baudRate: 9600, autoOpen: false });
// let lecturaPuerto = undefined;

// const reconnect = async (onfncData) => {
//   puertoSerial !== undefined && puertoSerial.close((retval) => {});

//   valoresConfigJson = readDataConfig(nameFileConfig);
//   portBaudRate = parseInt(valoresConfigJson.BALANZABAUDIOS);
//   portName = valoresConfigJson.BALANZAPORTCOM;

//   puertoSerial = new serialPort(portName, {
//     autoOpen: false,
//     baudRate: portBaudRate,
//   });

//   if (!puertoSerial.isOpen) {
//     puertoSerial.on('open', (retval) => {});

//     puertoSerial.on('close', (retval) => {
//       lecturaPuerto.on('data', () => null);
//     });

//     puertoSerial.open((err) => {
//       if (err === null) {
//         console.log(`Puerto ABIERTO`);
//         lecturaPuerto = puertoSerial.pipe(new readLineSerial({ delimiter: '\r\n' }));
//         lecturaPuerto.on('data', onfncData);
//       } else {
//         console.log(`Puerto CERRADO ${portName}.. re-abriendo en 3sec.`);
//         setTimeout(() => reconnect(onfncData), 3000);
//       }
//     });
//   }
// };

// const closePort = () => {
//   puertoSerial.close((retval) => {
//     console.log(`cerrar el puerto ${retval}`);
//   });
// };

// const settingData = async (BALANZAPORTCOM, BALANZABAUDIOS) => {
//   try {
//     await writeDataConfig(nameFileConfig, { BALANZAPORTCOM, BALANZABAUDIOS });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const readingData = () => {
//   return { ...valoresConfigJson, PORTISOPEN: puertoSerial.isOpen };
// };

// const allBalanzaPort = () => {
//   return serialPort.list().then((ports) => {
//     return [...ports];
//   });
// };

// process.stdin.resume(); //so the program will not close instantly

// const exitHandler = (options, exitCode) => {
//   if (options.cleanup) {
//     console.log('clean');
//     puertoSerialExp() !== undefined && puertoSerialExp().close((retval) => {});
//   }
//   if (exitCode || exitCode === 0) console.log(exitCode);
//   if (options.exit) process.exit();
// };

// //do something when app is closing
// process.on('exit', exitHandler.bind(null, { cleanup: true }));

// //catches ctrl+c event
// process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// // catches "kill pid" (for example: nodemon restart)
// process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
// process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// //catches uncaught exceptions
// process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

reconnect(onData);

module.exports = { serve, thePort, puertoSerialExp };
