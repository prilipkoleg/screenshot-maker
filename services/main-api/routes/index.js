const express = require('express');

const { authorizationJWT } = require('../middlewares');

const authRouter = require('./auth');
const apiRouter = require('./api');

const indexRouter = express.Router();
indexRouter.get('/', (req, res, next) => {
  return res.send('Express');
});

const useRoutes = (app) => {
  app.use('/', indexRouter);

  app.use('/auth', authRouter);
  app.post('/api/user/create', require('../controllers/user').postCreate);
  app.use('/api', authorizationJWT, apiRouter);
};

module.exports = useRoutes;
