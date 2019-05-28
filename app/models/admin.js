'use strict';

const vogels = require('vogels');
const Joi = require('joi');
const crypto = require('crypto');
const config = require('../../config');
vogels.AWS.config.update(config.aws);

const Admin = vogels.define('Admin', {
  hashKey: 'email',
  timestamps: true,
  schema: {
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
  options.attributes = options.attributes || ['name', 'email'];
  return Admin.get(options.email, {
    ConsistentRead: true,
    AttributesToGet: options.attributes
  }, cb);
};

Admin.list = function (options) {
  const criteria = options.criteria || [];
  const attributes = options.attributes || ['name', 'email'];
  const page = options.page || 0;
  const limit = options.limit || 30;
  const scan = Admin.scan();
  criteria.forEach(it => {
    switch (it.func) {
      case 'lt':
        scan = scan.where(it.where).lt(it.val);
        break;
      case 'lte':
        scan = scan.where(it.where).lt(it.val);
        break;
      case 'gt':
        scan = scan.where(it.where).gt(it.val);
        break;
      case 'gte':
        scan = scan.where(it.where).gte(it.val);
        break;
      case 'beginsWith':
        scan = scan.where(it.where).beginsWith(it.val);
        break;
      case 'between':
        scan = scan.where(it.where).between(it.val[0], it.val[1]);
        break;
      case 'equals':
      default:
        scan = scan.where(it.where).equals(it.val);
    }
  });

  return scan
    .attributes(attributes)
    .limit(limit)
    .skip(limit * page)
    .exec();
};

require('./_createTables')('Admin');

module.exports = Admin