'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const Admin = mongoose.model('Admin');

/**
 * Load admin
 */

exports.load = async(function*(req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = yield Admin.load({ criteria });
    if (!req.profile) return next(new Error('User not found'));
  } catch (err) {
    return next(err);
  }
  next();
});

/**
 * Create admin
 */

exports.create = async(function*(req, res) {
  const admin = new Admin(req.body);
  try {
    yield admin.save();
    req.logIn(admin, err => {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!');
      res.redirect('/');
    });
  } catch (err) {
    const errors = Object.keys(err.errors).map(
      field => err.errors[field].message
    );

    res.render('admins/signup', {
      title: 'Sign up',
      errors,
      admin
    });
  }
});

/**
 *  Show profile
 */

exports.show = function (req, res) {
  const admin = req.profile;
  res.render('admins/show', {
    title: admin.name,
    admin
  });
};


/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('admins/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('admins/signup', {
    title: 'Sign up',
    admin: new Admin()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login(req, res) {
  const redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}

/**
 * List
 */

exports.list = function (req, res) {

};