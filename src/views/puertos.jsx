const React = require('react');
const DefaultLayout = require('./layouts/default');

const puertos = ({ portAll }) => {
  return (
    <DefaultLayout title="Puertos">
      <h1>Muestra todos los puertos</h1>
      <div className='ul list'>
        {portAll.map(({ manufacturer, serialNumber, path, pnpId }) => {
          return (
            <img className='ui avatar image' src=""
            <li key={path}>
              {pnpId}
              {manufacturer} {serialNumber} {path}{' '}
            </li>
          );
        })}
      </div>
    </DefaultLayout>
  );
};

export default puertos;
