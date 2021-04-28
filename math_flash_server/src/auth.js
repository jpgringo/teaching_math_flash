const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const db = require('./db');
const secret = 'be vewy vewy quite'; // obviously, move this somewhere else!
const issuer = 'walters.xyz';

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
  logger.info(`using JwtStrategy… %o`, jwt_payload);
  return checkUser(jwt_payload.user.username, jwt_payload.user.password, done);
}));

function checkUser(username, password, cb) {
  try {
    logger.info(`checking user: ${username}/******`);
    const user = db.accounts.findByUsername(username);
    if (!user || user.password !== password) {
      return cb(null, false);
    } else {
      return cb(null, user);
    }
  } catch (e) {
    return cb(e);
  }
}

// this was a very, very useful link to figure out passport issues:
// https://dmitryrogozhny.com/blog/easy-way-to-debug-passport-authentication-in-express
passport.use(new LocalStrategy(
  function authenticateLocal(username, password, done) {
    logger.info(`attempt to authenticate using local strategy`);
    return checkUser(username, password, done);
  }
));

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.accounts.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.createToken = (req) => {
  return jwt.sign({
    user: req.user,
    issuer: issuer,
    audience: 'celestial-emporium-user',
    ip: req.ip
  }, secret);
}

const decodeToken = (token) => {
  return jwt.decode(token.replace(/^Bearer\s+/i, ''));
}

passport.decodeToken = decodeToken;

module.exports = passport;
