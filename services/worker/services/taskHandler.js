const Screenshot = require('../models/Screenshot');
const makeScreenshot = require('./makeScreenshot');
const miniO = require('../common/miniO');
const resize = require('./imageResizer');

module.exports = (task, cb) => {
  const {link, options, storagePath, screenshotId} = task || {};

  console.log('TASK', task);

  return Screenshot
    .updateOne(
      { _id: screenshotId },
      { $set: { 'task.status': 'inWorker' } }
    )
    .then(() => makeScreenshot(link, options))
    .then(buffer => {
      const {fullPage} = options;
      const width = parseInt(options.width);
      const height = parseInt(options.height);

      if (!fullPage && width && height) {
        // return resize(buffer, width, height)
      }
      return buffer;
    })
    .then((buffer) => miniO.saveScreenshot(storagePath, buffer))
    .then(() =>
      Screenshot.updateOne(
        { _id: screenshotId },
        { $set: { 'task.status': 'done', errorMessage: null } }
      )
    )
    .then(() => cb())
    .catch(error => {
      Screenshot
        .updateOne(
          { _id: screenshotId },
          { task: { status: 'error', errorMessage: error.message} }
        )
        .then(() => cb(error))
        .catch(e => cb(error));
    });
};