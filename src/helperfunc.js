'use strinct';

const fs = require('fs-extra');

const readDataConfig = async (fileConfig) => {
  try {
    const fileJson = await fs.readJson(fileConfig);
    return fileJson;
  } catch (error) {
    console.log(`error de lectura ${fileConfig}`);
    return writeDataConfig(fileConfig, { 'hola': 111 });
  }
};

const writeDataConfig = async (fileConfig, settingConfig) => {
  try {
    const dataToWrite = schemaConfig(settingConfig);
    await fs.writeJson(fileConfig, dataToWrite);
    return dataToWrite;
  } catch (error) {
    console.log(`error de escritura ${fileConfig}`);
  }
};

const schemaConfig = (valueEnt) => {
  return {
    BALANZAPORTCOM:
      valueEnt.BALANZAPORTCOM === undefined ? 'COM1' : valueEnt.BALANZAPORTCOM,
    BALANZABAUDIOS:
      valueEnt.BALANZABAUDIOS === undefined ? 1200 : parseInt(valueEnt.BALANZABAUDIOS),
  };
};

module.exports = { writeDataConfig, readDataConfig };
