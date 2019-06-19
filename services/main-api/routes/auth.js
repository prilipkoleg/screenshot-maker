const express  = require('express');
const { authorizationJWT } = require('../middlewares');

const User = require('../models/User');
const authService = require('../services/auth');

const authRouter = express.Router();

authRouter.post('/login', (req, res, next) => {
  const authData =
    typeof req.body === 'object' && req.body !== null && req.body
    || {};

  return User.authorize(authData.email, authData.password)
    .then(user => {
      return authService.issueTokenPair(req, user)
        .then(tokenPair => {
          res.send(tokenPair);
        })
    })
    .catch(next);
});

authRouter.post(
  '/logout',
  authorizationJWT,
  (req, res, next) => {
    return authService.removeSession(req)
      .then(() => res.send())
      .catch(next);
  });

authRouter.post('/refresh', (req, res, next) => {
  return authService.refreshToken(req)
    .then(tokenPair => res.send(tokenPair))
    .catch(next);
});

module.exports = authRouter;
