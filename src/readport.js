const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');
const { readDataConfig, writeDataConfig } = require('./helperfunc');

const nameFileConfig = './config.json';
let oldPortName = undefined;
let valoresConfigJson = undefined;
let portBaudRate = undefined;
let portName = undefined;
let puertoSerial = undefined; //new serialPort('COM1', { baudRate: 9600, autoOpen: false });
let lecturaPuerto = undefined;

const puertoSerialExp = () => puertoSerial;

// const reconnect = async (onfncData) => {
//   puertoSerial !== undefined &&
//     puertoSerial.close((retval) => {
//       if (retval === null) console.log(`Cerrando Puerto: ${oldPortName}`);
//     });

//   valoresConfigJson = readDataConfig(nameFileConfig);
//   portBaudRate = parseInt(valoresConfigJson.BALANZABAUDIOS);
//   portName = valoresConfigJson.BALANZAPORTCOM;

//   puertoSerial = new serialPort(portName, {
//     autoOpen: false,
//     baudRate: portBaudRate,
//   });

//   if (!puertoSerial.isOpen) {
//     puertoSerial.on('open', (retval) => {});

//     puertoSerial.on('close', (retval) => {
//       lecturaPuerto.on('data', () => null);
//     });

//     puertoSerial.open((err) => {
//       if (err === null) {
//         console.log(`Puerto ABIERTO => ${portName}`);
//         lecturaPuerto = puertoSerial.pipe(new readLineSerial({ delimiter: '\r\n' }));
//         lecturaPuerto.on('data', onfncData);
//         oldPortName = portName;
//       } else {
//         console.log(`Puerto CERRADO => ${portName}`);
//         // console.log(`Puerto CERRADO ${portName}.. re-abriendo en 3sec.`);
//         // setTimeout(() => reconnect(onfncData), 3000);
//       }
//     });
//   }
// };

const openPort = async (onfncData) => {
  let retvalport = { ok: false, message: `Puerto CERRADO` };
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
  let retvalport = { ok: false, message: `PUERTO  - CERRADO` };
  try {
    retvalport = closePort();
    portBaudRate = parseInt(portBaudRate, 10);
    await settingData(portName, portBaudRate);
    puertoSerial = serialPort(portName, {
      autoOpen: false,
      baudRate: portBaudRate,
    });

    if (!puertoSerial.isOpen) {
      puertoSerial.on('open', (retval) => {});

      puertoSerial.on('close', (retval) => {
        lecturaPuerto.on('data', () => null);
      });
      retvalport = { ok: false, message: `ABRIENDO PUERTO ${portName}` };

      await puertoSerial.open((err) => {
        if (err === null) {
          lecturaPuerto = puertoSerial.pipe(new readLineSerial({ delimiter: '\r\n' }));
          lecturaPuerto.on('data', onfncData);
        }
      });
      retvalport = { ok: true, message: `PUERTO CAPTURADO ${portName}` };
    }
  } catch (error) {
    retvalport = { ok: false, message: `Puerto CERRADO - Error ${error}` };
  }
  return retvalport;
};

const closePort = () => {
  let retvalport = { ok: false, message: `PUERTO CERRADO` };
  try {
    puertoSerial !== undefined &&
      puertoSerial.close((retval) => {
        if (retval !== null) retvalport = { ok: true, message: `PUERTO NO CERRADO` };
      });
  } catch (error) {
    retvalport = { ok: false, message: `PUERTO NO CERRADO - Error ${Error}` };
  }
  // console.log(retvalport);
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
  // reconnect,
  allBalanzaPort,
  readingData,
  // settingData,
  closePort,
  openPort,
  openPortNew,
};
