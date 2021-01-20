const Service = require('node-windows').Service;
const ruta = require('path');

const { readDataConfig } = require('./helperfunc');

const valoresConfigJson = readDataConfig('config.json');
// Create a new service object

const svc = new Service({
  name: 'Balanza Lector',
  description: 'Servidor web en nodejs, leer el puerto com? de balanza',
  script: 'C:\\Users\\pedro\\node\\apiserialport\\src\\index.js',
  // script: ruta.join(__dirname, 'index.js'),
  env: {
    PORT: valoresConfigJson.PORTHTTP,
    BALANZAPORTCOM: valoresConfigJson.BALANZAPORTCOM,
    BALANZABAUDIOS: valoresConfigJson.BALANZABAUDIOS,
  },
  // nodeOptions: ['--harmony', '--max_old_space_size=4096'],
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start();
  console.log(`Visite http://localhost:${valoresConfigJson.PORTHTTP}/`);
  console.log('Servicio creado exitosamente, Balanza Comunicacion');
});

svc.on('start', () => {
  try {
    console.log('start');
  } catch (err) {
    console.log(err);
  }
});

svc.on('uninstall', () => {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

// svc.on('stop', () => {
//   console.log("Service stopped!")
//   console.log('The service exists: ',svc.exists);
// });

// svc.on('start', () => {
//   console.log("Service start..!!!")
//   console.log('The service exists: ',svc.exists);
// });

const serviceInstall = () => {
  svc.install();
};

const serviceUninstall = () => {
  svc.uninstall();
};

// const serviceStop =()=>{
//   // svc.stop();
// }

const serviceStart = () => {
  svc.restart();
  console.log('Service start..!!!');
  console.log('The service exists: ', svc.exists);
};

module.exports = { serviceInstall, serviceUninstall, serviceStart };
