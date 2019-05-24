'use strict';

const { wrap: async } = require('co');

/*
 *  Define res.err & res.success
 */
exports.apiResponse = function (req, res, next) {
  res.err = function (statusCode, payload) {
    res.status(statusCode);
    if (~process.env.HOSTS.indexOf(req.headers.host)) {
      res.render(`errors/${statusCode}`, payload);
    } else {
      res.json(payload);
    }
  };

  res.success = function (payload) {
    res.json(payload);
  };

  next();
};


/*
 *  Parse token and set req.user & req.userRole
 */

exports.parseToken = async(function* (req, res, next) {
  if (req.headers.token) {
    const token = req.headers.token;
    const models = require('../../app/models');
    try {
      const OrgToken = models.OrgToken;
      req.org = OrgToken.load(token).org;
      return next();
    } catch (err) { }
    try {
      const RcpToken = models.RcpToken;
      req.user = RcpToken.load(token).rcp;
      return next();
    } catch (err) { }

    if (!req.org && !req.rcp) {
      return next(new Error('Invalid token'));
    }
  }

  next();
});