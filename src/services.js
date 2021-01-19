const Service = require('node-windows').Service;
const ruta = require('path');
// const dotenv = require('dotenv');
// dotenv.config();
console.log(ruta.join(__dirname, 'index.js'));

const { readDataConfig } = require('./helperfunc');

const valoresConfigJson = readDataConfig('config.json');
// Create a new service object
var svc = new Service({
  name: 'Balanza Comunicacion',
  description:
    'Servidor web en nodejs, lee el puerto com? de balanza, enviando el resuntado por http:',
  // script: 'C:\\Users\\pedro\\node\\apiserialport\\src\\index.js',
  script: ruta.join(__dirname, 'index.js'),
  env: {
    PORT: valoresConfigJson.PORTHTTP,
    BALANZAPORTCOM: valoresConfigJson.BALANZAPORTCOM,
    BALANZABAUDIOS: valoresConfigJson.BALANZABAUDIOS,
  },
  nodeOptions: ['--harmony', '--max_old_space_size=4096'],
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

console.log(svc);
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', () => {
  svc.start();
});

svc.install();
