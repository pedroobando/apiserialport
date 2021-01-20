const { serviceInstall, serviceUninstall, serviceStart}= require('./servicesrestart')

const installVar = process.env['INSTALL'] || 'OFF'

if(installVar==='ON') {
    serviceInstall();
} 

if(installVar==='OFF') {
    serviceUninstall();
}

if(installVar==='START') {
    serviceStart();
}



// const Service = require('node-windows').Service;
// const ruta = require('path');

// const { readDataConfig } = require('./helperfunc');

// const valoresConfigJson = readDataConfig('config.json');
// // Create a new service object

// const svc = new Service({
//   name: 'Balanza Comunicacion',
//   description:
//     'Servidor web en nodejs, leer el puerto com de balanza.',
//   // script: 'C:\\Users\\pedro\\node\\apiserialport\\src\\index.js',
//   script: ruta.join(__dirname, 'index.js'),
//   env: {
//     PORT: valoresConfigJson.PORTHTTP,
//     BALANZAPORTCOM: valoresConfigJson.BALANZAPORTCOM,
//     BALANZABAUDIOS: valoresConfigJson.BALANZABAUDIOS,
//   },
// //   nodeOptions: ['--harmony', '--max_old_space_size=4096'],
//   //, workingDirectory: '...'
//   //, allowServiceLogon: true
// });

// // Listen for the "install" event, which indicates the
// // process is available as a service.
// svc.on('install', () => {
//   svc.start();
//   console.log(`Visite http://localhost:${valoresConfigJson.PORTHTTP}/`);
//   console.log('Servicio creado exitosamente, Balanza Comunicacion');
// });


// svc.install();
// svc.start();
