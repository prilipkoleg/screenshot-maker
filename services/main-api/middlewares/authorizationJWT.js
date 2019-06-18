const jwtMiddleware = require('express-jwt');

const config = require('../config');
const HttpError = require('../errors').HttpError;

const middleware = (req, res, next) => {
  jwtMiddleware(
    {secret: config.auth.jwt.secret}
  )(req, res, (error) => {
    if (!error) return next();

    next(HttpError.adapter.jwt(error));
  });
};

module.exports = middleware;
