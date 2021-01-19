const _PORTHTTP = document.getElementById('PORTHTTP');
const _BALANZABAUDIOS = document.getElementById('BALANZABAUDIOS');
const _BALANZAPORTCOM = document.getElementById('BALANZAPORTCOM');
const _BALANZASTATUS = document.getElementById('BALANZASTATUS');

function main() {
  try {
    fetch('/config.json')
      .then((resultado) => resultado.json())
      .then((resultado) => {
        // console.log(resultado);
        _PORTHTTP.value = resultado.PORTHTTP;
        _BALANZABAUDIOS.value = resultado.BALANZABAUDIOS;
        _BALANZAPORTCOM.value = resultado.BALANZAPORTCOM;
        if (resultado.BALANZASTATUS === 'ERROR') {
          _BALANZASTATUS.innerHTML =
            'ERROR EN COMUNICACION CON BALANZA, VERIFICAR PUERTO O VELOCIDAD DE TRANSMICION';
        }
        // _BALANZASTATUS.innerHTML = resultado.BALANZASTATUS;
      });
  } catch (error) {
    console.error('Error leyendo archivo config.json');
  }
}

main();
