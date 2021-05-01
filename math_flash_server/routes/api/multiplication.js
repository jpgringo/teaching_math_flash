var express = require('express');
var router = express.Router();
const auth = require('../../src/auth');
const logger = require('../../src/logger').createNamedLogger('api/multiplication');
const timesTables = require('../../src/problems/times-tables')

router.get('/', function (req, res) {
  res.sendStatus(403);
});

router.options('*', function (req, res, next) {
  next();
});

router.get('*', auth.authenticate('jwt', {session: false}));


router.get('/questions', function(req, res) {
  const authToken = auth.decodeToken(req.headers.authorization);
  const username = authToken && authToken.user ? authToken.user.username : undefined;
  logger.info(`will get next question for user '${username}'…`);
  res.json(timesTables.getAllProblemsForUser(username));
});

router.get('/questions/next', function(req, res) {
  const authToken = auth.decodeToken(req.headers.authorization);
  const username = authToken && authToken.user ? authToken.user.username : undefined;
  logger.info(`will get next question for user '${username}'…`);
  res.json(timesTables.getNextProblem(username));
});

router.post('/questions/answer', function(req, res) {
  const authToken = auth.decodeToken(req.headers.authorization);
  const username = authToken && authToken.user ? authToken.user.username : undefined;
  logger.info(`will check answer for user '${username}'…`);
  res.json(timesTables.checkAndRecordAnswerForUser(username, req.body.question, req.body.answer));
});

module.exports = router;
