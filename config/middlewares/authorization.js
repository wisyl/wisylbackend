'use strict';

/*
 *  Parse token and set req.user & req.userRole
 */
const { wrap: async } = require('co');

exports.parseToken = async(function*(req, res, next) {
  if (req.headers && req.headers.token) {
    const token = req.headers.token;
    const mongoose = require('mongoose');
    try {
      const OrgToken = mongoose.model('OrgToken');
      req.org = OrgToken.load(token).org;
      return next();
    } catch (err) {}
    try {
      const RcpToken = mongoose.model('RcpToken');
      req.user = RcpToken.load(token).rcp;
      return next();
    } catch (err) {}

    if (!req.org && !req.rcp) {
      return next(new Error('Invalid token'));
    }
  }

  next();
});


/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

/*
 *  User authorization routing middleware
 */

exports.admin = {
  hasAuthorization: function(req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/users/' + req.profile.id);
    }
    next();
  }
};
