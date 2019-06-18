const { Router } = require('express');
const userController = require('../../controllers/user');

const userRouter = new Router();

userRouter.route('/')
  .post(userController.postCreate)
;

userRouter.route('/:userId')
  .get(userController.getById)
  .post(userController.postCreate)
;


module.exports = userRouter;
