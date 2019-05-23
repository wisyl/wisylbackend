'use strict';

/**
 * Module dependencies
 */

const fs = require('fs');
const dotenv = require('dotenv');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
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

/**
 * Expose
 */

module.exports = app;

// Bootstrap models
const models = join(__dirname, 'app/models');
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

connect();

function listen() {
  if (app.get('env') === 'test') return;
  const port = process.env.PORT;
  app.listen(port);
  console.log('Express app started on port ' + port);
}

function connect() {
  const config = require('./config');

  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect(config.db, { keepAlive: 1, useNewUrlParser: true });
}
