let pjson = require('../package.json');
const router = require('express').Router();

router.get('/read', (req, res) => {
  try {
    const { hora, valorPeso, valorEstable } = req.app.locals.sendData;
    const sendData = {
      apps: pjson.name,
      version: pjson.version,
      hora,
      valorPeso,
      valorEstable,
    };
    res.status(200).json(sendData);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
