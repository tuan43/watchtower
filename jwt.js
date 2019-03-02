const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const _ = require('lodash');

const users = require('./users.js');
const secretKey = require('./secretKey.js');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey
};

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
  const { username } = jwt_payload;
  const authUser = _.find(users, { username });

  if (authUser) {
      return done(null, authUser);
  }
  return done(null, false);
});