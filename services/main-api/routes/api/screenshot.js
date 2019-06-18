const { Router } = require('express');
const screenshotController = require('../../controllers/screenshot');

const screenshotRouter = new Router();

screenshotRouter.route('/')
  .get(screenshotController.getAll)
  .post(screenshotController.postCreate);

screenshotRouter.route('/:screenshotId')
  .get(screenshotController.getById)
  .post(screenshotController.postReCreate)
  .delete(screenshotController.deleteById);


module.exports = screenshotRouter;
