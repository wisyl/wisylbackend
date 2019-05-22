'use strict';

exports.apiResponse = function (req, res, next) {
  res.apiError = function (statusCode, err) {
    res.status(statusCode).json({
      error: err.message
    });
  };

  res.apiSuccess = function (payload) {
    res.json(Object.assign({
      success: true
    }, payload));
  };

  next();
};