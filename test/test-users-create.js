'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const test = require('tape');
const request = require('supertest');
const app = require('../server');
const { cleanup } = require('./helper');
const Admin = mongoose.model('Admin');

test('Clean up', cleanup);

test('no email - should respond with errors', t => {
  request(app)
    .post('/admins')
    .field('name', 'Foo bar')
    .field('email', '')
    .field('password', 'foobar')
    .expect('Content-Type', /html/)
    .expect(200)
    .expect(/Email cannot be blank/)
    .end(async err => {
      const count = await Admin.countDocuments().exec();
      t.ifError(err);
      t.same(count, 0, 'count of users should be 0');
      t.end();
    });
});

test('no name - should respond with errors', t => {
  request(app)
    .post('/admins')
    .field('name', '')
    .field('email', 'foobar@example.com')
    .field('password', 'foobar')
    .expect('Content-Type', /html/)
    .expect(200)
    .expect(/Name cannot be blank/)
    .end(async err => {
      const count = await Admin.countDocuments().exec();
      t.ifError(err);
      t.same(count, 0, 'count of users should be 0');
      t.end();
    });
});

test('valid signup - should redirect to /', t => {
  request(app)
    .post('/admins')
    .field('name', 'Foo bar')
    .field('email', 'foobar@example.com')
    .field('password', 'foobar')
    .expect('Content-Type', /plain/)
    .expect('Location', /\//)
    .expect(302)
    .end(async err => {
      const count = await Admin.countDocuments().exec();
      const user = await Admin.findOne({ username: 'foobar' }).exec();
      t.ifError(err);
      t.same(count, 1, 'count of users should be 1');
      t.same(user.email, 'foobar@example.com');
      t.end();
    });
});

test('Clean up', cleanup);
