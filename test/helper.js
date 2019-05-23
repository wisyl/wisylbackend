'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const co = require('co');

/**
 * Clear database
 *
 * @param {Object} t<Ava>
 * @api public
 */

exports.cleanup = function (t) {
  co(function*() {
    yield Admin.deleteMany();
    t.end();
  });
};
