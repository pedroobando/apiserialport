const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');
const { readDataConfig, writeDataConfig } = require('./helperfunc');

const nameFileConfig = './config.json';
// let oldPortName = undefined;
let valoresConfigJson = undefined;
// let portBaudRate = undefined;
// let portName = undefined;
var puertoSerial = undefined; //new serialPort('COM1', { baudRate: 9600, autoOpen: false });
var lecturaPuerto = undefined;

const puertoSerialExp = () => puertoSerial;

const openPort = async (onfncData) => {
  var retvalport = { ok: false, message: `Puerto CERRADO` };
  try {
    const valoresConfigJson = await readDataConfig(nameFileConfig);
    const portBaudRate = parseInt(valoresConfigJson.BALANZABAUDIOS);
    const portName = valoresConfigJson.BALANZAPORTCOM;
    retvalport = await openPortNew(portName, portBaudRate, onfncData);
    // console.log(`retvalport ${retvalport}`);
  } catch (error) {
    retvalport = { ok: false, message: `Puerto CERRADO - Error ${error}` };
  }
  return retvalport;
};

const openPortNew = async (
  portName = 'COM1',
  portBaudRate = 9600,
  onfncData = () => {}
) => {
  var retvalport = { ok: false, message: `PUERTO  - CERRADO` };
  try {
    retvalport = closePort();
    portBaudRate = parseInt(portBaudRate, 10);
    await settingData(portName, portBaudRate);
    puertoSerial = serialPort(portName, {
      autoOpen: false,
      baudRate: portBaudRate,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
    });

    if (!puertoSerial.isOpen) {
      puertoSerial.on('open', (retval) => {});

      puertoSerial.on('close', (retval) => {
        lecturaPuerto.on('data', () => null);
      });
      retvalport = { ok: false, message: `ABRIENDO PUERTO ${portName}` };

      puertoSerial.open((err) => {
        if (!err) {
          lecturaPuerto = puertoSerial.pipe(new readLineSerial({ delimiter: '\r\n' }));
          lecturaPuerto.on('data', onfncData);
          return { ok: true, message: `PUERTO CAPTURADO ${portName}` };
        } else {
          return { ok: false, message: `PUERTO NO CAPTURADO ${portName}` };
        }
      });
      retvalport = { ok: true, message: `ABRIENDO PUERTO ${portName}` };
    }
  } catch (error) {
    retvalport = { ok: false, message: `Puerto CERRADO - Error ${error}` };
  }
  return retvalport;
};

const closePort = () => {
  var retvalport = { ok: true, message: `PUERTO CERRADO` };
  try {
    puertoSerial !== undefined &&
      puertoSerial.close((retval) => {
        retvalport = { ok: !retval, message: `PUERTO CERRADO` };
      });
  } catch (error) {
    retvalport = { ok: false, message: `PUERTO NO CERRADO - Error ${Error}` };
  }
  return retvalport;
};

const readingData = () => {
  return { ...valoresConfigJson };
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
  allBalanzaPort,
  readingData,
  closePort,
  openPort,
  openPortNew,
};
