const fs = require('fs-extra');

const readDataConfig = (fileConfig) => {
  try {
    const fileJson = fs.readJsonSync(fileConfig);
    // console.log(fileJson);
    return fileJson;
    // return fs.readJson(fileConfig);
  } catch (error) {
    console.log(`error de lectura ${fileConfig}`);
    return writeDataConfig(fileConfig, { 'hola': 111 });
  }
};

const writeDataConfig = (fileConfig, settingConfig) => {
  try {
    const dataToWrite = schemaConfig(settingConfig);
    // console.log(fileConfig, dataToWrite);
    fs.writeJsonSync(fileConfig, dataToWrite);
    // console.log(dataToWrite);
    return dataToWrite;
  } catch (error) {
    console.log(`error de escritura ${fileConfig}`);
  }
};

const schemaConfig = (valueEnt) => {
  return {
    PORTHTTP: valueEnt.PORTHTTP === undefined ? 3000 : parseInt(valueEnt.PORTHTTP, 10),
    BALANZAPORTCOM:
      valueEnt.BALANZAPORTCOM === undefined ? 'COM1' : valueEnt.BALANZAPORTCOM,
    BALANZABAUDIOS:
      valueEnt.BALANZABAUDIOS === undefined ? 1200 : parseInt(valueEnt.BALANZABAUDIOS),
  };
};

module.exports = { writeDataConfig, readDataConfig };
