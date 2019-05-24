'use strict';

/**
 * Module dependencies.
 */

const Admin = require('../app/models/admin');
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
