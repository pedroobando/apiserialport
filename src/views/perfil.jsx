const React = require('react');
const DefaultLayout = require('./layouts/default');

const perfil = ({ name }) => {
  return (
    <DefaultLayout title="Serial Port">
      <h1>Hola mundo {name}</h1>
    </DefaultLayout>
  );
};

export default perfil;
