const express  = require('express');

const screeshotRouter = require('./screenshot');
const userRouter = require('./user');

const apiRouter = express.Router();

apiRouter.use('/screenshot', screeshotRouter);
apiRouter.use('/user', userRouter);

module.exports = apiRouter;

