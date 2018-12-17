const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const dotenv = require('dotenv');

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// load up the user model
const User = require('../models/User');

module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = jwtSecret;
  passport.use(new JwtStrategy(opts, ((jwtPayload, done) => {
    User.findOne({ id: jwtPayload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  })));
};
