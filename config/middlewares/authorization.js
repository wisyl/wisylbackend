'use strict';

/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

/*
 *  User authorization routing middleware
 */

exports.admin = {
  hasAuthorization: function (req, res, next) {
    if (req.admin.email != req.user.email) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/cms/admins/' + req.admin.email);
    }
    next();
  }
};
