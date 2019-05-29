'use strict';

const vogels = require('vogels');
const Joi = require('joi');
const crypto = require('crypto');
const config = require('../../config');
vogels.AWS.config.update(config.aws);

const Admin = vogels.define('Admin', {
  hashKey: 'id',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(),
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
  data.salt = makeSalt();
  data.hashed_password = encryptPassword(data.salt, data.password);

  delete data.password;
  delete data._csrf;

  next(null, data);
});

//Admin.before('update', function (data, next) {
//  if (!data.password) return next(null, data);

//  if (!data.password.length) {
//    return next(new Error('Password can not be empty'), data)
//  }
//  data.salt = makeSalt();
//  data.hashed_password = encryptPassword(data.salt, data.password);
//  next(null, data);
//});


/**
 * Methods
 */

Admin.prototype.authenticate = function (plainText) {
  return encryptPassword(this.get('salt'), plainText) === this.get('hashed_password');
};

const makeSalt = function () {
  return Math.round(new Date().valueOf() * Math.random()) + '';
};

const encryptPassword = function (salt, password) {
  if (!password) return '';
  try {
    return crypto
      .createHmac('sha1', salt)
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
  options.attributes = options.attributes || ['id', 'name', 'email'];
  if (options.id) {
    return Admin.get(options.id, {
      ConsistentRead: true,
      AttributesToGet: options.attributes
    }, cb);
  } else {
    return Admin.scan()
      .where('email').equals(options.email)
      .exec((err, result) => {
        if (err) return cb(err, null);
        return cb(err, result.Count > 0 ? result.Items[0] : null);
      });
  }
};

require('./_createTables')('Admin');

module.exports = Admin