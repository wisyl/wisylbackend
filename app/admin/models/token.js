'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Token Schema
 */

const TokenSchema = new Schema({
  token: String,
  user: { type: Schema.ObjectId, ref: 'AdmUser' },
  lastUsedAt: { type: Date, default: Date.now }
});

/**
 * Validations
 */

/**
 * Methods
 */

TokenSchema.methods = {
  
  /**
   * Update lastUsedAt
   *
   * @api private
   */

  updateLastUsedAt: function() {
    this.lastUsedAt = Date.now();
    return this.save();
  }
};

/**
 * Statics
 */

TokenSchema.statics = {
  /**
   * Find token by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function(token) {
    return this.findOne({ token: token })
      .populate('user', 'name email')
      .exec();
  },

  /**
   * List tokens
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const constant = require('../../../config/constant');

    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || constant.pageLimit;
    return this.find(criteria)
      .populate('user', 'name email')
      .sort({ lastUsedAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('AdmToken', TokenSchema);
