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
                <img className="ui avatar image" src="/pubic/comserial.png" />
                <div className="content">
                  <a href={`/?selectport=${path}`} className="ui blue header h3">
                    PORT &nbsp; {path}
                  </a>

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
