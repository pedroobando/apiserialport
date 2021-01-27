const Service = require('node-windows').Service;
const ruta = require('path');

const { readDataConfig } = require('./helperfunc');

const valoresConfigJson = readDataConfig('config.json');
// Create a new service object

const svc = new Service({
  name: 'Balanza Lector',
  description: 'Servidor web nodejs, leer puerto COM de balanza',
  // script: 'C:\\Users\\pedro\\node\\apiserialport\\src\\index.js',
  script: ruta.join(__dirname, 'index.js'),
  env: {
    BALANZAPORTCOM: valoresConfigJson.BALANZAPORTCOM,
    BALANZABAUDIOS: valoresConfigJson.BALANZABAUDIOS,
  },
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start();
  console.log('Install complete.');
  console.log('The service exists: ', svc.exists);
});

svc.on('start', () => {
  try {
    console.log('Service starting...');
    console.log('The service starting Now: ', svc.exists);
  } catch (err) {
    console.log(err);
  }
});

svc.on('uninstall', () => {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

svc.on('stop', () => {
  try {
    console.log('Service stopped!');
    console.log('The service exists: ', svc.exists);
  } catch (err) {
    console.log(err);
  }
});

const serviceInstall = () => {
  svc.install();
};

const serviceUninstall = () => {
  svc.uninstall();
};

const serviceStop = () => {
  svc.stop();
};

const serviceStart = () => {
  svc.start();
};

module.exports = { serviceInstall, serviceUninstall, serviceStart, serviceStop };
