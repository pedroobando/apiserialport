const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');
const { readDataConfig, writeDataConfig } = require('./helperfunc');

const nameFileConfig = './config.json';
let valoresConfigJson = undefined;
var puertoSerial = undefined; //new serialPort('COM1', { baudRate: 9600, autoOpen: false });
var lecturaPuerto = undefined;

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
    portBaudRate = parseInt(portBaudRate, 10);
    await settingData(portName, portBaudRate);
    puertoSerial = serialPort(portName, {
      autoOpen: false,
      baudRate: portBaudRate,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
    });

    puertoSerial.on('open', (retval) => {
      console.log('port Opened');

      process.stdin.resume();
      process.stdin.setEncoding('utf-8');
    });

    puertoSerial.on('error', (err) => {
      console.log(`Hmm..., ${err.message}`);
      process.exit(1);
    });

    puertoSerial.on('close', (retval) => {
      console.log('close');
      process.stdin.end();
    });

    puertoSerial.open((err) => {
      if (!err) {
        lecturaPuerto = puertoSerial.pipe(new readLineSerial({ delimiter: '\r\n' }));
        lecturaPuerto.on('data', onfncData);
        retvalport = { ok: true, message: `PUERTO CAPTURADO ${portName}` };
      } else {
        retvalport = { ok: false, message: `PUERTO NO CAPTURADO ${portName}` };
      }
    });

    retvalport = {
      ok: true,
      message: `ABRIENDO PUERTO - portName=${portName} baudRate=${portBaudRate}`,
    };
  } catch (error) {
    retvalport = { ok: false, message: `Puerto CERRADO - Error ${error}` };
    process.exit(1);
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
  allBalanzaPort,
  readingData,
  closePort,
  openPort,
  openPortNew,
};
