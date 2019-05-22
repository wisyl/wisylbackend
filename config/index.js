'use strict';

/**
 * Module dependencies.
 */

const path = require('path');

/**
 * Expose
 */

module.exports = {
  db: process.env.MONGODB_URL,
  root: path.join(__dirname, '..'),
};
