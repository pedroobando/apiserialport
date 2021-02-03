const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const readPort = () => {
  try {
    const port = new SerialPort('/dev/ttyACM0', {
      autoOpen: false,
      baudRate: 9600,
    });

    port.open((err) => {
      if (err) {
        return console.log('Error opening port: ', err.message);
      }
      port.write('main screen tourn on');
      // const lecturaPuerto = port.pipe(new readLineSerial({ delimiter: '\r\n' }));

      // lecturaPuerto.on('data', (listener) => {
      //   console.log(listener);
      // });

      // lecturaPuerto.on('data', (listener) => {
      //   console.log(listener);
      //   return;
      // });

      // const readx = port.read();
      // console.log(readx);
      // port.read()
    });
    // port.on('readable', () => {
    //   console.log(`Data: ${port.read(6)}`);
    // });

    const lineStream = port.pipe(new Readline());
    lineStream.on('data', (data) => {
      console.log(data);
    });

    // port.on('data', function (data) {
    //   console.log('Data:', data.toString());
    // });

    // port.close();
    // res.status(200).json({ statusOk: true });
  } catch (error) {
    console.log(error);
  }
};

readPort();
