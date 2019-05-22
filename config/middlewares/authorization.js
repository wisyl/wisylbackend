'use strict';

/*
 *  Parse token and set req.user & req.role
 */
const { wrap: async } = require('co');
const constant = require('../constant');

exports.parseToken = async(function*(req, res, next) {
  if (req.headers && req.headers.token) {
    const token = req.headers.token;
    const mongoose = require('mongoose');
    try {
      const AdmToken = mongoose.model('AdmToken');
      req.user = AdmToken.load(token).user;
      if (req.user) req.role = constant.role.admin;
      return next();
    } catch (err) {}
    //try {
    //  const AdmToken = mongoose.model('AdmToken');
    //  req.user = AdmToken.load(token).user;
    //  if (req.user) req.role = constant.role.admin;
    //  return next();
    //} catch (err) {}
    //try {
    //  const AdmToken = mongoose.model('AdmToken');
    //  req.user = AdmToken.load(token).user;
    //  if (req.user) req.role = constant.role.admin;
    //  return next();
    //} catch (err) {}
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

exports.user = {
  hasAuthorization: function(req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/users/' + req.profile.id);
    }
    next();
  }
};

/*
 *  Article authorization routing middleware
 */

exports.article = {
  hasAuthorization: function(req, res, next) {
    if (req.article.user.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/articles/' + req.article.id);
    }
    next();
  }
};

/**
 * Comment authorization routing middleware
 */

exports.comment = {
  hasAuthorization: function(req, res, next) {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (
      req.user.id === req.comment.user.id ||
      req.user.id === req.article.user.id
    ) {
      next();
    } else {
      req.flash('info', 'You are not authorized');
      res.redirect('/articles/' + req.article.id);
    }
  }
};
