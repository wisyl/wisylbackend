'use strict';

/*
 * Module dependencies.
 */

const controllers = {
  dashboard: require('../app/controllers/dashboard'),
  admins: require('../app/controllers/admins'),
};

/**
 * Route middlewares
 */

const middlewares = {
  auth: require('./middlewares/authorization'),
  init: require('./middlewares/init'),
};

/**
 * Expose routes
 */

module.exports = function (app, passport) {
  const pauth = passport.authenticate.bind(passport);

  // middleware
  app.use(middlewares.init.apiResponse);
  app.use(middlewares.init.parseToken);


  // CMS
  app.param('adminId', controllers.admins.load);
  app.get('/', middlewares.auth.requiresLogin, controllers.dashboard.index);
  app.get('/login', controllers.admins.login);
  app.get('/signup', controllers.admins.signup);
  app.get('/logout', controllers.admins.logout);
  app.post('/admins', controllers.admins.create);
  app.post(
    '/admins/session',
    pauth('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }),
    controllers.admins.session
  );
  app.get('/admins/:adminId', middlewares.auth.requiresLogin, controllers.admins.show);
  app.get('/cms/admins', middlewares.auth.requiresLogin, controllers.admins.list);
  app.get('/cms/orgs', middlewares.auth.requiresLogin, controllers.orgs.list);
  app.get('/cms/rcps', middlewares.auth.requiresLogin, controllers.rcps.list);

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    
    // treat as 404
    if (
      err.message &&
      (~err.message.indexOf('not found') ||
        ~err.message.indexOf('Cast to ObjectId failed'))
    ) {
      return next();
    }

    console.error(err.stack);

    // error page
    const payload = { error: err.stack };
    if (err.stack.includes('ValidationError')) {
      return res.err(422, payload);
    }

  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    res.err(404, payload);
  });
};
