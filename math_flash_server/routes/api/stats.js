const router = require('express').Router();
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

router.get('/questions', function (req, res) {
  const authToken = auth.decodeToken(req.headers.authorization);
  const username = authToken && authToken.user ? authToken.user.username : undefined;
  logger.info(`will get all questions for user '${username}'…`);
  res.json(timesTables.getAllProblemsForUser(username));
});

router.get('/ranges', function (req, res) {
  const authToken = auth.decodeToken(req.headers.authorization);
  const username = authToken && authToken.user ? authToken.user.username : undefined;
  logger.info(`will get all questions for user '${username}'…`);
  const allQuestionsByRange = timesTables.getAllQuestionsByRange(username);
  logger.info(`allQuestionsByRange: %o`, allQuestionsByRange);
  res.json(
    Array.from(allQuestionsByRange.entries()).reduce((acc, [key, val]) => {
      logger.info(`key=${key}, val=${val}`);
      acc[key] = val;
      return acc;
    }, {}));
});

module.exports = router;
