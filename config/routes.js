'use strict';

/*
 * Module dependencies.
 */

const admin = {
  users: require('../app/admin/controllers/users'),
}

/**
 * Route middlewares
 */

const auth = require('./middlewares/authorization');
const init = require('./middlewares/init');

/**
 * Expose routes
 */

module.exports = function (app) {
  app.use((req, res, next) => {
    console.log('test');
    next();
  });
  app.use(init.apiResponse);
  app.use(auth.parseToken);

  app.param('adminId', admin.users.load);

  // home route
  app.get('/', admin.users.login);

  // user routes
  app.get('/admin/login', admin.users.login);
  app.get('/admin/signup', admin.users.signup);
  app.get('/admin/logout', admin.users.logout);
  app.post('/admin/login', admin.users.signin);
  app.post('/admin/users', admin.users.create);
  app.get('/admin/users/:adminId', admin.users.show);
  
  /**
   * Error handling
   */

  app.use(function(err, req, res, next) {
    // treat as 404
    if (
      err.message &&
      (~err.message.indexOf('not found') ||
        ~err.message.indexOf('Cast to ObjectId failed'))
    ) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function(req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    //if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('404', payload);
  });
};
