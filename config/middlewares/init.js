'use strict';

const { wrap: async } = require('co');

/*
 *  Define res.apiError & res.apiSuccess
 */
exports.apiResponse = function (req, res, next) {
  res.apiError = function (statusCode, err) {
    res.status(statusCode).json({
      error: err.message
    });
  };

  res.apiSuccess = function (payload) {
    res.json(Object.assign({
      success: true
    }, payload));
  };

  next();
};


/*
 *  Parse token and set req.user & req.userRole
 */

exports.parseToken = async(function* (req, res, next) {
  if (req.headers.token) {
    const token = req.headers.token;
    const mongoose = require('mongoose');
    try {
      const OrgToken = mongoose.model('OrgToken');
      req.org = OrgToken.load(token).org;
      return next();
    } catch (err) { }
    try {
      const RcpToken = mongoose.model('RcpToken');
      req.user = RcpToken.load(token).rcp;
      return next();
    } catch (err) { }

    if (!req.org && !req.rcp) {
      return next(new Error('Invalid token'));
    }
  }

  next();
});