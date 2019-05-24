'use strict';

/**
 * Module dependencies.
 */

const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../../app/models/admin');

/**
 * Expose
 */

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    const options = {
      criteria: { email: email },
      select: 'name email hashed_password salt'
    };
    Admin.load(options, function (err, admin) {
      if (err) return done(err);
      if (!admin) {
        return done(null, false, { message: 'Unknown admin' });
      }
      if (!admin.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, admin);
    });
  }
);