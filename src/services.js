var Service = require('node-windows').Service;
const dotenv = require('dotenv');
dotenv.config();

// Create a new service object
var svc = new Service({
  name: 'Balanza Lector',
  description:
    'Servidor web en nodejs, lee el puerto com? de balanza, enviando el resuntado por http:',
  script: 'C:\\Users\\pedro\\node\\apiserialport\\src\\index.js',
  env: {
    PORT: 4000,
    BALANZAPORTCOM: 'COM4',
    BALANZABAUDIOS: 9600,
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
