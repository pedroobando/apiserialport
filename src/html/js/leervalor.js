const _PORTHTTP = document.getElementById('PORTHTTP');
const _BALANZABAUDIOS = document.getElementById('BALANZABAUDIOS');
const _BALANZAPORTCOM = document.getElementById('BALANZAPORTCOM');

function main() {
  try {
    fetch('/config.json')
      .then((resultado) => resultado.json())
      .then((resultado) => {
        // console.log(resultado);
        _PORTHTTP.value = resultado.PORTHTTP;
        _BALANZABAUDIOS.value = resultado.BALANZABAUDIOS;
        _BALANZAPORTCOM.value = resultado.BALANZAPORTCOM;
      });
  } catch (error) {
    console.error('Error leyendo archivo config.json');
  }
}

main();
