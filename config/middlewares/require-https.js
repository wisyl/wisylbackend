// Force https

// Taken from this answer on S.O
// https://stackoverflow.com/a/31144924

module.exports = function requireHTTPS(req, res, next) {
  const env = process.env.NODE_ENV;
  if (
    !req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    env !== 'development' &&
    env !== 'test'
  ) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
};
