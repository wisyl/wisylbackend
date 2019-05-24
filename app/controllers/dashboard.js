'use strict';

/**
 * Module dependencies.
 */

const { wrap: async } = require('co');
const Admin = require('../models/admin');

/**
 * Load dashboard data (statistics)
 */

exports.index = async(function* (req, res) {
  res.render('index', {
    title: 'Dashboard',
  });
});