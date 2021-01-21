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
