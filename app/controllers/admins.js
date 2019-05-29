'use strict';

/**
 * Module dependencies.
 */

const only = require('only');
const Admin = require('../models/Admin');
const constant = require('../../config/constant');

/**
 * Load admin
 */

exports.load = function (req, res, next, id) {
  Admin.load({ id }, (err, admin) => {
    if (err) return next(err);
    req.admin = admin;
    if (!req.admin) return next(new Error('Admin not found'));

    next();
  });
};

/**
 * Create admin
 */

exports.create = function (req, res) {
  try {
    Admin.create(only(req.body, 'email password name'), (err, admin) => {
      if (err) {
        console.log(err);
        req.flash('info', 'Sorry! We are not able to log you in!');
        return res.redirect('/');
      }
      req.logIn(admin, err => {
        if (err) req.flash('info', 'Sorry! We are not able to log you in!');
        res.redirect('/');
      });
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
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  res.render('admins/show', {
    title: req.admin.attrs.name,
    admin: req.admin
  });
};


/**
 * Show login form
 */

exports.login = function (req, res) {
  if (req.user) return res.redirect('/');

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
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const limit = req.query.limit || constant.pageLimit;
  Admin
    .scan()
    .limit(limit)
    .attributes('id name email'.split(' '))
    .loadAll()
    .exec((err, result) => {
      if (err) return next(err);
      res.render('admins/list', {
        title: 'Administrators',
        admins: result.Items,
        page: page + 1,
        pages: 1//Math.ceil(count / limit)
      });
    });
};