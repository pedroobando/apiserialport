const React = require('react');
const { useState } = require('react');

const DefaultLayout = require('./layouts/default');

const home = ({ initialState }) => {
  const [formValues, setFormValues] = useState(initialState);
  const { PORTHTTP, BALANZABAUDIOS, BALANZAPORTCOM, PORTISOPEN } = formValues;

  const handleInputChange = ({ target }) => {
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  return (
    <DefaultLayout title="Inicio">
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
          <p>Valores del servidor web</p>
          <div className="inline field">
            <div className="ui right pointing label">Puerto http</div>
            <input
              id="PORTHTTP"
              type="text"
              name="PORTHTTP"
              value={PORTHTTP}
              onChange={handleInputChange}
              placeholder="8081 / 8088 / 3000 / 4000 ..."
            />
          </div>

          <div className="ui divider"></div>
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
            &nbsp;&nbsp;
            {PORTISOPEN && <label className="ui green label">ABIERTO </label>}
            {!PORTISOPEN && <label className="ui red label">CERRADO</label>}
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

          <button type="submit" className="ui positive basic button">
            Guardar y Aplicar
          </button>
          <button className="ui button">Cancelar</button>
        </form>

        <p>Al realizar cualquier cambio, se debe de arrancar de nuevo el servicio.</p>
      </div>
    </DefaultLayout>
  );
};

module.exports = home;
