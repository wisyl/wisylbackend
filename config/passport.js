'use strict';

/*!
 * Module dependencies.
 */

const Admin = require('../app/models/admin');
const local = require('./passport/local');

/**
 * Expose
 */

module.exports = function (passport) {
  // serialize sessions
  passport.serializeUser((admin, cb) => cb(null, admin.email));
  passport.deserializeUser((id, cb) =>
    Admin.load({ criteria: { _id: id } }, cb)
  );

  // use these strategies
  passport.use(local);
};