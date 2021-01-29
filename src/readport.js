const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');
const { readDataConfig, writeDataConfig } = require('./helperfunc');

const nameFileConfig = './config.json';

let valoresConfigJson = undefined;
let portBaudRate = undefined;
let portName = undefined;
let puertoSerial = undefined; //new serialPort('COM1', { baudRate: 9600, autoOpen: false });
let lecturaPuerto = undefined;

const puertoSerialExp = () => puertoSerial;

const reconnect = async (onfncData) => {
  puertoSerial !== undefined && puertoSerial.close((retval) => {});

  valoresConfigJson = readDataConfig(nameFileConfig);
  portBaudRate = parseInt(valoresConfigJson.BALANZABAUDIOS);
  portName = valoresConfigJson.BALANZAPORTCOM;

  puertoSerial = new serialPort(portName, {
    autoOpen: false,
    baudRate: portBaudRate,
  });

  if (!puertoSerial.isOpen) {
    puertoSerial.on('open', (retval) => {});

    puertoSerial.on('close', (retval) => {
      lecturaPuerto.on('data', () => null);
    });

    puertoSerial.open((err) => {
      if (err === null) {
        console.log(`Puerto ABIERTO`);
        lecturaPuerto = puertoSerial.pipe(new readLineSerial({ delimiter: '\r\n' }));
        lecturaPuerto.on('data', onfncData);
      } else {
        console.log(`Puerto CERRADO ${portName}.. re-abriendo en 3sec.`);
        setTimeout(() => reconnect(onfncData), 3000);
      }
    });
  }
};

const settingData = async (BALANZAPORTCOM, BALANZABAUDIOS) => {
  try {
    await writeDataConfig(nameFileConfig, { BALANZAPORTCOM, BALANZABAUDIOS });
  } catch (error) {
    console.log(error);
  }
};

const allBalanzaPort = () => {
  return serialPort.list().then((ports) => {
    return [...ports];
  });
};

module.exports = {
  puertoSerialExp,
  reconnect,
  allBalanzaPort,
  settingData,
};
