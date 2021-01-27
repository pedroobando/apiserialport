const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const socket = require('socket.io');

// const dotenv = require('dotenv');
const cors = require('cors');

const {
  initBalanzaPort,
  allBalanzaPort,
  settingData,
  readingData,
} = require('./readport');

// initialization
const serve = express();
// const iosocket = socket(serve);

// const valoresConfigJson = readDataConfig('./config.json');
// const thePort = valoresConfigJson.PORTHTTP;
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
    const valor = reciveData.slice(-7);
    _sendData = { ok: true, hora: dateString, valor };
    _fechaTomaData = new Date();
    // console.log(_sendData);
  } catch (error) {
    _sendData = { ok: false };
    // console.log(error);
  }
};

initBalanzaPort(onData);

// routes

serve.use('/public', express.static(rutaStaticCss));

serve.get('/', (req, res) => {
  try {
    const { selectport } = req.query;
    const initialState = readingData();

    if (selectport !== undefined) initialState.BALANZAPORTCOM = selectport;
    res.render('home', { initialState });
  } catch (error) {
    res.redirect('/?selectport=null');
  }
});

serve.post('/', (req, res) => {
  try {
    const { BALANZABAUDIOS, BALANZAPORTCOM } = req.body;

    settingData(BALANZAPORTCOM, BALANZABAUDIOS);
    initBalanzaPort(onData);
    res.redirect(req.get('referer'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/read', (req, res) => {
  let codeStatus = 409;
  const _noSendData = { ok: false, msg: 'no existes datos' };
  try {
    const fechaActual = new Date();

    const resta = fechaActual.getTime() - _fechaTomaData.getTime();
    if (resta > 1800) {
      _sendData = _noSendData;
    } else {
      codeStatus = 200;
    }
    res.status(codeStatus).json(_sendData);
  } catch (error) {
    // console.log(error);
    res.status(codeStatus).json(_noSendData);
  }
});

serve.get('/puertos', (req, res) => {
  try {
    const portAll = allBalanzaPort();
    portAll.then((item) => {
      // console.log(item);
      res.status(200).render('puertos', { portAll: item });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.use(function (req, res, next) {
  res.status(404).send('Lo siento no encuentro la ruta..!');
});

module.exports = { serve, thePort };
