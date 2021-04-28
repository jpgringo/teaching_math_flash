var express = require('express');
var router = express.Router();
const logger = require('../../src/logger').createNamedLogger('api/multiplication');

router.get('/', function (req, res, next) {
  res.sendStatus(403);
});

router.get('/question', function(req, res) {
  logger.info(`will get next question…`);
  res.json({msg: 'will send next question'})
});

module.exports = router;
