const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const dotenv = require('dotenv');
const cors = require('cors');

const {
  initBalanzaPort,
  allBalanzaPort,
  settingData,
  readingData,
} = require('./readport');

// initialization
const serve = express();
dotenv.config();

// const valoresConfigJson = readDataConfig('./config.json');
// const thePort = valoresConfigJson.PORTHTTP;
const thePort = 3000;

// const rutaRaizStatic = path.join(__dirname, './html');
const rutaStaticCss = path.join(__dirname, './public');
const rutaReinicio = path.join(__dirname, 'stop./html');

serve.use(cors());
serve.use(bodyParser.json());
serve.use(bodyParser.urlencoded({ extended: true }));

serve.set('views', __dirname + '/views');
serve.set('view engine', 'jsx');
var options = { beautify: true };
serve.engine('jsx', require('express-react-views').createEngine(options));

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
    console.log(error);
  }
};

initBalanzaPort(onData);

// routes

serve.use('/css', express.static(rutaStaticCss));
serve.use('/stop', express.static(rutaReinicio));

serve.get('/', (req, res) => {
  const initialState = readingData();
  res.render('home', { initialState });
});

serve.post('/', (req, res) => {
  try {
    const { BALANZABAUDIOS, BALANZAPORTCOM } = req.body;

    settingData(BALANZAPORTCOM, BALANZABAUDIOS);
    initBalanzaPort(onData);
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/read', (req, res) => {
  try {
    res.status(200).json(_sendData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/puertos', (req, res) => {
  try {
    const portAll = allBalanzaPort();
    portAll.then((item) => {
      console.log(item);
      res.status(200).render('puertos', { portAll: item });
    });
    // console.log(item));
    // console.log(portAll);
    // res.redirect('/');
    // res.status(200).render('puertos', { portAll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

serve.get('/perfil', async (req, res) => {
  const fsx = require('fs-extra');
  await fsx.writeJson('./src/package2.json', { name: 'fs-extra' });
  console.log('success!');
  res.render('perfil', { name: 'Pedro Obando' });
});

serve.use(function (req, res, next) {
  res.status(404).send('Lo siento no encuentro la ruta..!');
});

module.exports = { serve, thePort };
