const React = require('react');
const { useState } = require('react');

const DefaultLayout = require('./layouts/default');

const home = ({ initialState, iplocal }) => {
  const [formValues, setFormValues] = useState(initialState);
  const { BALANZABAUDIOS, BALANZAPORTCOM } = formValues;

  const handleInputChange = ({ target }) => {
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  return (
    <DefaultLayout title="Inicio" iplocal={iplocal}>
      <div className="ui segment">
        <h3 className="ui header">SerialPort</h3>
        <p>
          Es un pluging cuya funciones leer el puerto serial del la balanza DIGI - modelo
          DS-781/782(RS). Y emitirlo por via web mediante http, indicandole la ruta y el
          puerto de salida de la peticion.
        </p>

        <p>
          La balanza, tiene que ser configurada para transmitir data continua (Standard
          Stream). Con la finalidad que traiga solamente el valor del peso.
        </p>
      </div>

      <div className="ui segment">
        <div className="ui header">Configuracion</div>

        <form method="POST" action="/" className="ui fluid form">
          <p>Valores de comunicacion con la balanza</p>
          <div className="inline field">
            <div className="ui right pointing label">Puerto comunicacion</div>
            <input
              id="BALANZAPORTCOM"
              type="text"
              name="BALANZAPORTCOM"
              value={BALANZAPORTCOM}
              placeholder="Puerto / PORT"
              onChange={handleInputChange}
            />
          </div>
          <div className="inline field">
            <div className="ui right pointing label">Velocidad trasmicion</div>
            <input
              id="BALANZABAUDIOS"
              type="text"
              name="BALANZABAUDIOS"
              value={BALANZABAUDIOS}
              placeholder="1200 2400 4600 ... 9600"
              onChange={handleInputChange}
            />
          </div>
          <p>Al realizar cualquier cambio, debe presionar [Guardar y aplicar].</p>{' '}
          <div className="ui divider"></div>
          <button type="submit" className="ui positive basic button">
            Guardar y Aplicar
          </button>
          <button className="ui button">Cancelar</button>
        </form>
      </div>
    </DefaultLayout>
  );
};

module.exports = home;
