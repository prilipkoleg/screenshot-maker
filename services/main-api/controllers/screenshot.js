const uuid = require('uuid/v4');

const amqp = require('../common/amqp');
const miniO = require('../common/miniO');
const Screenshot = require('../models/Screenshot');
const validator = require('../services/validator');

module.exports = {

  getAll: (req, res, next) => {
    const userId = req.user.id;

    return Screenshot.find({userId})
      .lean()
      .then(docs => {
        const result =
          docs
          && docs.length
          && docs.map(d => {
            delete d.__v;
            return d;
          })
          || [];

        res.send(result);
      })
      .catch(next);
  },

  getById: (req, res, next) => {
    const sceenshotId = req.params.screenshotId;
    const userId = req.user.id;

    return Screenshot.findOne({_id: sceenshotId, userId})
      .lean()
      .then(doc => {
        if (!doc) return next();

        res.send(doc);
      })
      .catch(next);
  },

  deleteById: (req, res, next) => {
    const sceenshotId = req.params.screenshotId;
    const userId = req.user.id;

    return Screenshot.findOne({_id: sceenshotId, userId})
      .then(doc => {
        if (!doc) return next();

        return miniO.deleteScreenshot(doc.storagePath)
          .then(() => doc.delete())
          .then(() => res.send())
          .catch(next)
        throw new Error('Remove It from bucket too!!!!!');

        return doc.delete()
          .then(() => res.send());
      })
      .catch(next);

    // res.json({ mess: `will be DELETE by ${sceenshotId}`});
  },

  postCreate: (req, res, next) => {
    const data = req.body;

    try {
      validator.validate(data, validator.schema.createScreenshot);
    } catch (e) {
      return next(e);
    }

    const screenshotId = uuid();
    const userId = req.user.id;
    const fileName = `${screenshotId}.png`;

    const screenshotData = {
      _id: screenshotId,
      userId,
      fileName,
      ...data,
    };

    const screenshot = new Screenshot(screenshotData);
    screenshot.setStoragePath();

    const payload = {
      ...data,
      screenshotId,
      storagePath: screenshot.storagePath,
    };

    return screenshot.save()
      .then(() => amqp.newTask.screenshot(payload))
      .then(() => res.send({id: screenshot._id}))
      .catch(next);
  },

  postReCreate: (req, res, next) => {
    const screenshotId = req.params.screenshotId;
    const userId = req.user.id;

    return Screenshot.findOne({_id: screenshotId, userId})
      .lean()
      .then(doc => {
        if (!doc) return next();

        const payload = {
          screenshotId,
          link: doc.link,
          options: doc.options,
          storagePath: doc.storagePath,
        };

        return Screenshot.updateOne(
            { _id: screenshotId },
            { 'task.status': 'created'}
          )
          .then(() => amqp.newTask.screenshot(payload))
      })
      .then(() => res.send({id: screenshotId}))
      .catch(next);
  },

};
