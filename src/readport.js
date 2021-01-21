// const express = require('express');

const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');

const { readDataConfig, writeDataConfig } = require('./helperfunc');

const valoresConfigJson = readDataConfig('config.json');

const onErrorOpenPort = (messageErr) => {
  if (messageErr !== null) {
    console.log('PORT CLOSE');
  } else {
    console.log('PORT OPEN');
  }
};

const baudRate = parseInt(valoresConfigJson.BALANZABAUDIOS);
const portName = valoresConfigJson.BALANZAPORTCOM;
const puertoSerial = new serialPort(portName, { baudRate }, onErrorOpenPort);
const lecturaPuerto = puertoSerial.pipe(new readLineSerial());

const onOpenPort = () => {
  try {
    console.log(`Puerto conectado: ${portName}`);
  } catch (error) {
    console.error(`error apertura ${error}`);
  }
};

const openBalanzaPort = (onData) => {
  try {
    // lecturaPuerto.on('open', onOpenPort);
    lecturaPuerto.on('data', onData);
    lecturaPuerto.on('error', (err) => {
      console.log('Error: porno ', err.message);
    });
  } catch (error) {
    console.error(`Error lectura ${error}, Equipo: ${portName}, baudRate: ${baudRate}`);
  }
};

const closeBalanzaPort = () => {
  lecturaPuerto.on('open', onOpenPort);
};

// const SerialPort = require('serialport');
const allBalanzaPort = () => {
  // let retval = [{ 'test': 1 }];
  return serialPort.list().then((ports) => {
    return ports;
  });
  // returnconsole.log(oo);
  // return retval;
  // (ports) => ports.forEach(console.log),
  // (err) => console.error(err)
};

module.exports = {
  puertoSerial,
  openBalanzaPort,
  closeBalanzaPort,
  allBalanzaPort,
};
