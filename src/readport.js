const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');

const { readDataConfig, writeDataConfig } = require('./helperfunc');

const nameFileConfig = './config.json';

let valoresConfigJson = undefined;
let portBaudRate = undefined;
let portName = undefined;
let puertoSerial = undefined;
let lecturaPuerto = undefined;

const initBalanzaPort = (onfncData) => {
  valoresConfigJson = readDataConfig(nameFileConfig);
  try {
    if (puertoSerial !== undefined) {
      puertoSerial.isOpen &&
        puertoSerial.close((err) => {
          if (err !== null) {
            console.log('puerto cerrado');
          }
        });
    }

    portBaudRate = parseInt(valoresConfigJson.BALANZABAUDIOS);
    portName = valoresConfigJson.BALANZAPORTCOM;
    puertoSerial = serialPort(portName, { autoOpen: false, baudRate: portBaudRate });
    lecturaPuerto = puertoSerial.pipe(new readLineSerial());

    if (!puertoSerial.isOpen) {
      puertoSerial.open((err) => {
        if (err === null) {
          console.log(`Puerto ABIERTO`);
          lecturaPuerto.on('data', onfncData);
        } else {
          console.log(`Puerto CERRADO ${portName}`);
          lecturaPuerto.on('data', () => console.log('cerrado'));
          puertoSerial == undefined;
        }
      });
    }

    console.log({
      path: puertoSerial.path,
      setting: puertoSerial.settings,
      opening: puertoSerial.opening,
      closing: puertoSerial.closing,
    });
  } catch (error) {
    console.error(`Error open ${error}, Equipo: ${portName}, baudRate: ${portBaudRate}`);
  }
};

const dataBalanzaPort = (onData) => {
  try {
    lecturaPuerto.on('data', onData);
  } catch (error) {
    console.error(
      `Error lectura ${error}, Equipo: ${portName}, baudRate: ${portBaudRate}`
    );
  }
};

const settingData = (BALANZAPORTCOM, BALANZABAUDIOS) => {
  try {
    writeDataConfig(nameFileConfig, { BALANZAPORTCOM, BALANZABAUDIOS });
  } catch (error) {
    console.log(error);
  }
};

const readingData = () => {
  return { ...valoresConfigJson, PORTISOPEN: puertoSerial.isOpen };
};

const allBalanzaPort = () => {
  return serialPort.list().then((ports) => {
    return [...ports];
  });
};

module.exports = {
  puertoSerial,
  initBalanzaPort,
  dataBalanzaPort,
  allBalanzaPort,
  settingData,
  readingData,
};
