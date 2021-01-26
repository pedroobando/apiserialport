const { serve, thePort } = require('./server');

const main = () => {
  serve.listen(thePort, () => {
    console.log(`Lector / Puerto:${thePort}`);
  });
};

main();
