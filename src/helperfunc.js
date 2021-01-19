const fs = require('fs-extra');

const readDataConfig = (fileConfig) => {
  try {
    return fs.readJsonSync(fileConfig);
  } catch (error) {
    return writeDataConfig(fileConfig, { 'hola': 111 });
  }
};

const writeDataConfig = (fileConfig, settingConfig) => {
  try {
    fs.writeJsonSync(fileConfig, schemaConfig(settingConfig));
    return fs.readJsonSync(fileConfig);
  } catch (error) {
    console.log(`Error: ${error}`);
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
