'use strict';

/**
 * Module dependencies
 */

const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');

// .env
dotenv.config();

// override env-specific .env file
const env = process.env.NODE_ENV || 'development';
const envConfig = dotenv.parse(fs.readFileSync(`.env.${env}`));
for (let k in envConfig) {
  process.env[k] = envConfig[k];
}

// add custom env
process.env.NODE_ENV = env;
process.env.HOSTS = [
  process.env.HOST,
  '172.20.11.12',
  '10.0.75.1'
].map(host => `${host}:${process.env.PORT}`);

const app = express();
app.set('env', process.env.NODE_ENV);

/**
 * Expose
 */

module.exports = app;

// routes
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

listen();

function listen() {
  if (app.get('env') === 'test') return;
  const port = process.env.PORT;
  app.listen(port);
  console.log('Express app started on port ' + port);
}
