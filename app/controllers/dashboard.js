'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const Admin = mongoose.model('Admin');

/**
 * Load dashboard data (statistics)
 */

exports.index = async(function* (req, res) {
  res.render('index', {
    title: 'Dashboard',
  });
});