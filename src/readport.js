const express = require('express');

const serialPort = require('serialport');
const readLineSerial = require('@serialport/parser-readline');
const path = require('path');

const { readDataConfig, writeDataConfig } = require('./helperfunc');

// initialization
const serve = express();

const valoresConfigJson = readDataConfig('config.json');
const thePort = valoresConfigJson.PORTHTTP;

const onErrorOpenPort = (messageErr) => {
  console.log(messageErr);
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

const onData = (data) => {
  try {
    const dateNow = new Date();
    const dateString =
      ('0' + dateNow.getHours()).slice(-2) +
      ':' +
      ('0' + dateNow.getMinutes()).slice(-2) +
      ':' +
      ('0' + dateNow.getSeconds()).slice(-2);

    let reciveData = data.toString();
    reciveData = reciveData.replace(/(\r\n|\n|\r|\=)/gm, '');

    if (reciveData.slice(-2) === 'KG') {
      valorPeso = reciveData;
    }

    if (reciveData.slice(0, 1) === 'S') {
      valorEstable = reciveData;
      _sendData = { hora: dateString, valorPeso, valorEstable };
      // console.log(_sendData);
    }
  } catch (error) {
    console.error(error);
  }
};

const openBalanzaPort = () => {
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

let valorPeso = '';
let valorEstable = '';

module.exports = { serve, thePort };
