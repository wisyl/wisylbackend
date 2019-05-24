'use strict';

const vogels = require('vogels');
const Joi = require('joi');
const crypto = require('crypto');
const uuid = require('uuid4')
const config = require('../../config');
vogels.AWS.config.update(config.aws);

const Admin = vogels.define('Admin', {
  hashKey: 'id',
  timestamps: true,
  schema: {
    id: Joi.string(),
    name: Joi.string().trim().regex(/^[A-Za-z ]{3,}$/),
    email: Joi.string().email().trim().required(),
    hashed_password: Joi.string(),
    salt: Joi.string(),
  }
});

/**
 * Hooks
 */

Admin.before('create', function (data, next) {
  if (!data.password || !data.password.length) {
    return next(new Error('Password can not be empty'), data)
  }
  data.id = uuid();
  data.salt = data.makeSalt();
  data.hashed_password = data.encryptPassword(data.password);
  next(null, data);
});

Admin.before('update', function (data, next) {
  if (!data.password) return next(null, data);

  if (!data.password.length) {
    return next(new Error('Password can not be empty'), data)
  }
  data.salt = data.makeSalt();
  data.hashed_password = data.encryptPassword(data.password);
  next(null, data);
});


/**
 * Methods
 */

Admin.prototype.authenticate = function (plainText) {
  return this.encryptPassword(plainText) === this.hashed_password;
};

Admin.prototype.makeSalt = function () {
  return Math.round(new Date().valueOf() * Math.random()) + '';
};

Admin.prototype.encryptPassword = function (password) {
  if (!password) return '';
  try {
    return crypto
      .createHmac('sha1', this.salt)
      .update(password)
      .digest('hex');
  } catch (err) {
    return '';
  }
}

/**
 * Statics
 */

Admin.load = function (options, cb) {
  options.select = options.select || 'name email';
  return this.findOne(options.criteria)
    .select(options.select)
    .exec(cb);
};

Admin.list = function (options) {
  const criteria = options.criteria || {};
  const page = options.page || 0;
  const limit = options.limit || 30;
  return this.find(criteria)
    .limit(limit)
    .skip(limit * page)
    .exec();
};

vogels.createTables(function (err) {
  if (err) {
    console.log('Error creating Admin table: ', err);
    return process.exit(1);
  }
  console.log('Admin table has been created');

});

module.exports = Admin