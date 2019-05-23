'use strict';

/**
 * Module dependencies.
 */

const Notifier = require('notifier');
const config = require('../../../config');

/**
 * Process the templates using swig - refer to notifier#processTemplate method
 *
 * @param {String} tplPath
 * @param {Object} locals
 * @return {String}
 * @api public
 */

Notifier.prototype.processTemplate = function (tplPath, locals) {
  locals.filename = tplPath;
  const pug = require('pug');
  return pug.renderFile(tplPath, locals);
};

/**
 * Expose
 */

module.exports = {
  /**
   * Comment notification
   *
   * @param {Object} options
   * @param {Function} cb
   * @api public
   */

  comment: function (options, cb) {
    const article = options.article;
    const author = article.user;
    const user = options.currentUser;
    const notifierOptions = {
      tplPath: path.join(__dirname, '..', 'app/mailer/templates'),

      service: 'postmark', // or 'sendgrid'
      key: 'SERVICE_KEY',
      email: true,
      actions: ['comment'],
      sendgridUser: 'SENDGRID_USER',

      // for apple push notifications
      APN: false,
      //parseAppId: 'APP_ID',
      //parseApiKey: 'MASTER_KEY',
      //parseChannels: ['USER_' + author._id.toString()]
    };
    const notifier = new Notifier(notifierOptions);

    const obj = {
      to: author.email,
      from: process.env.EMAIL_NOREPLY,
      subject: user.name + ' added a comment on your article ' + article.title,
      alert: user.name + ' says: "' + options.comment,
      locals: {
        to: author.name,
        from: user.name,
        body: options.comment,
        article: article.name
      }
    };

    try {
      notifier.send('comment', obj, cb);
    } catch (err) {
      console.log(err);
    }
  }
};
