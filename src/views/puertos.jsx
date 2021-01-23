const React = require('react');
const DefaultLayout = require('./layouts/default');

const puertos = ({ portAll }) => {
  return (
    <DefaultLayout title="Puertos">
      <h1>Muestra todos los puertos</h1>
      <div className="ui list">
        {portAll.map(
          ({ manufacturer, serialNumber, path, pnpId, productId, vendorId }) => {
            return (
              <div className="item" key={path}>
                <img className="ui avatar image" src="/css/comserial.png" />
                <div className="content">
                  <h3 className="ui blue header">PORT &nbsp; {path}</h3>

                  <ul className="ui list">
                    <li>
                      manufacturer: <strong>{manufacturer}</strong>
                    </li>
                    <li>
                      serialNumber: <strong>{serialNumber}</strong>
                    </li>
                    <li>
                      productId: <strong>{productId}</strong> - vendorId: {vendorId}
                    </li>
                    <li>pnpId: {pnpId} </li>
                  </ul>
                </div>
              </div>
            );
          }
        )}
      </div>
    </DefaultLayout>
  );
};

export default puertos;
