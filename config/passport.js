'use strict';

/*!
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const local = require('./passport/local');

/**
 * Expose
 */

module.exports = function (passport) {
  // serialize sessions
  passport.serializeUser((admin, cb) => cb(null, admin.id));
  passport.deserializeUser((id, cb) =>
    Admin.load({ criteria: { _id: id } }, cb)
  );

  // use these strategies
  passport.use(local);
};