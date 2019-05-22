'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const TwitterStrategy = require('passport-twitter').Strategy;
const config = require('../');
const User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new TwitterStrategy(
  {
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    passReqToCallback: true,
  },
  function(accessToken, refreshToken, profile, done) {
    const options = {
      criteria: { 'twitter.id_str': profile.id }
    };
    User.load(options, function(err, user) {
      if (err) return done(err);
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'twitter',
          twitter: profile._json
        });
        user.save(function(err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }
);
