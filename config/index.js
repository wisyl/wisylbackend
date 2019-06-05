'use strict';

/**
 * Module dependencies.
 */

const path = require('path');

/**
 * Expose
 */

module.exports = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT
  },
  root: path.join(__dirname, '..'),
};
