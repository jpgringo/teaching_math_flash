var express = require('express');
var router = express.Router();
const logger = require('../../src/logger');
const auth = require('../../src/auth');
const accounts = require('../../src/db').accounts;
const multiplicationRouter = require('./multiplication');

router.get('/', function (req, res, next) {
  res.sendStatus(403);
});

router.post('/auth',
  auth.authenticate('local'),
  function (req, res) {
    const authToken = auth.createToken(req);
    const user = Object.assign({}, accounts.findByUsername(req.body.username));
    delete user.password;
    res.json({token: authToken, user: user});
    // res.json({msg: 'well, this works...'});
  });


router.use('/multiplication', multiplicationRouter);

module.exports = router;
