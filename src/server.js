const express = require('express');
const bodyParser = require('body-parser');
// const serialPort = require('serialport');
// const readLineSerial = require('@serialport/parser-readline');
const path = require('path');

const dotenv = require('dotenv');
const cors = require('cors');
// const pjson = require('../package.json');

const { readDataConfig, writeDataConfig } = require('./helperfunc');
// const { serviceStart, serviceStop } = require('./servicesrestart');

const {
  openBalanzaPort,
  closeBalanzaPort,
  puertoSerial,
  allBalanzaPort,
} = require('./readport');

// initialization
const serve = express();
dotenv.config();

const valoresConfigJson = readDataConfig('config.json');
const thePort = valoresConfigJson.PORTHTTP;

const rutaRaizStatic = path.join(__dirname, './html');
const rutaStaticCss = path.join(__dirname, './public');
const rutaReinicio = path.join(__dirname, 'stop./html');

serve.use(cors());
serve.use(bodyParser.json());
serve.use(bodyParser.urlencoded({ extended: true }));

// template

// serve.set('views', './views');
// serve.engine('jsx', consolidate.react);
// serve.set('view engine','jsx')

serve.set('views', __dirname + '/views');
serve.set('view engine', 'jsx');
var options = { beautify: true };
serve.engine('jsx', require('express-react-views').createEngine(options));

// const onErrorOpenPort = (messageErr) => {
//   if (messageErr !== null) {
//     console.log(messageErr);
//   }
// };

// const baudRate = parseInt(valoresConfigJson.BALANZABAUDIOS);
// const portName = valoresConfigJson.BALANZAPORTCOM;
// const puertoSerial = new serialPort(portName, { baudRate }, onErrorOpenPort);
// const lecturaPuerto = puertoSerial.pipe(new readLineSerial());

// try {
//   lecturaPuerto.on('open', onOpenPort);
//   lecturaPuerto.on('data', onData);
//   lecturaPuerto.on('error', (err) => {
//     console.log('Error: porno ', err.message);
//   });
//   lecturaPuerto.on('close', (err) => {
//     err.disconnected == true;
//   });
// } catch (error) {
//   console.log(`Error lectura ${error}, Equipo: ${portName}, baudRate: ${baudRate}`);
// }

// function onOpenPort() {
//   try {
//     console.log(`Puerto conectado: ${portName}`);
//   } catch (error) {
//     console.log(`error apertura ${error}`);
//   }
// }

// let valorPeso = '';
// let valorEstable = '';

// function onData(data) {
//   try {
//     const dateNow = new Date();
//     const dateString =
//       ('0' + dateNow.getHours()).slice(-2) +
//       ':' +
//       ('0' + dateNow.getMinutes()).slice(-2) +
//       ':' +
//       ('0' + dateNow.getSeconds()).slice(-2);

//     // const horaActual = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
//     let reciveData = data.toString();
//     reciveData = reciveData.replace(/(\r\n|\n|\r|\=)/gm, '');

//     if (reciveData.slice(-2) === 'KG') {
//       valorPeso = reciveData;
//     }

//     if (reciveData.slice(0, 1) === 'S') {
//       valorEstable = reciveData;
//       _sendData = { hora: dateString, valorPeso, valorEstable };

//       // const sendData = { hora: dateString, valorPeso, valorEstable };
//       // serve.locals.sendData = sendData;
//       // console.log(_sendData);
//     }
//   } catch (error) {
//     console.log(`data: ${error}`);
//   }
// }

let _sendData = undefined;
let valorPeso = '';
let valorEstable = '';

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

    if (reciveData.slice(-2) === 'KG') {
      valorPeso = reciveData;
    }

    if (reciveData.slice(0, 1) === 'S') {
      valorEstable = reciveData;
      _sendData = { hora: dateString, valorPeso, valorEstable };
      // console.log(_sendData);
    }
  } catch (error) {
    // console.log(error);
  }
};

openBalanzaPort(onData);

// routes

// serve.use('/', express.static(rutaRaizStatic));
serve.use('/css', express.static(rutaStaticCss));
serve.use('/stop', express.static(rutaReinicio));

serve.get('/', (req, res) => {
  const { PORTHTTP, BALANZAPORTCOM, BALANZABAUDIOS } = readDataConfig('config.json');
  res.render('home', { initialState: { PORTHTTP, BALANZABAUDIOS, BALANZAPORTCOM } });
});

serve.post('/', (req, res) => {
  try {
    console.log(req.body);
    // const retorno = writeDataConfig('config.json', req.body);
    // serviceStop();
    // puertoSerial.close();

    // puertoSerial.update({ baudRate: retorno.BALANZABAUDIOS });
    // puertoSerial.open();
    // res.status(200).redirect('/');
    res.redirect('/');
    // filePath = __dirname + '/html/stop.html';

    // if (path.existsSync(filePath)) {
    //   res.sendFile(filePath);
    // } else {
    //   res.statusCode = 404;
    //   res.write('404 sorry not found');
    //   res.end();
    // }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/read', async (req, res) => {
  try {
    res.status(200).json(_sendData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/portall', async (req, res) => {
  try {
    const aaas = allBalanzaPort();
    aaas.then((ports) => {
      res.status(200).json(ports);
      // console.log(ports);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/configport', (req, res) => {
  try {
    // const retorno = readDataConfig('config.json');
    // res.status(200).json(retorno);
    // res.sendFile('./html/stop.html');

    filePath = __dirname + '/html/stop.html';

    if (path.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.statusCode = 404;
      res.write('404 sorry not found');
      res.end();
    }
  } catch (error) {}
});

serve.get('/config.json', (req, res) => {
  try {
    const dataConfig = readDataConfig('config.json');
    res.status(200).json(dataConfig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/perfil', (req, res) => {
  res.render('perfil', { name: 'Pedro Obando' });
});

serve.use(function (req, res, next) {
  res.status(404).send('Lo siento no encuentro la ruta..!');
});

module.exports = { serve, thePort };
