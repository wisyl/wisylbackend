'use strict';

/*!
 * Module dependencies.
 */

const Admin = require('../app/models/Admin');
const local = require('./passport/local');

/**
 * Expose
 */

module.exports = function (passport) {
  // serialize sessions
  passport.serializeUser((admin, cb) => cb(null, admin.email));
  passport.deserializeUser((email, cb) =>
    Admin.load({ email }, cb)
  );

  // use these strategies
  passport.use(local);
};