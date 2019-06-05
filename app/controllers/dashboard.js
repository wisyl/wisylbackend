'use strict';

/**
 * Module dependencies.
 */

const Admin = require('../models/Admin');

/**
 * Load dashboard data (statistics)
 */

exports.index = function (req, res) {
  res.render('index', {
    title: 'Dashboard',
  });
};