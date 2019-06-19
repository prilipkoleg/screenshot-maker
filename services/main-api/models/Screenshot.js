const uuid = require('uuid/v4');
const mongoose = require('mongoose');

// const { HttpError, codes } = require('../errors').HttpError;

const Schema = mongoose.Schema;

const ScreenshotSchema = new Schema({
  _id: {
    type: mongoose.SchemaTypes.String,
    default: uuid,
  },
  userId: {
    type: mongoose.SchemaTypes.String,
    unique: false,
    required: true,
  },
  link: {
    type : mongoose.SchemaTypes.String,
    unique: false,
    required: true,
  },
  options: {
    type: mongoose.SchemaTypes.Object,
    required: false,
  },
  storagePath: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  fileName: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: false,
  },
  task:{
    status: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: false,
      enum: ['created', 'inProgress', 'done', 'failed', ],
      default: 'created',
    },
    errorMessage: {
      type: mongoose.SchemaTypes.String,
      required: false,
    }
  },
}, {
  collection: 'screenshot',
  timestamps: true,
});

ScreenshotSchema.index({ userId: 1 }, { unique: false });
ScreenshotSchema.index({ storagePath: 1, }, { unique: true });
ScreenshotSchema.index({ 'task.status': 1, }, { unique: true });

ScreenshotSchema.methods.setStoragePath = function() {
  this.storagePath = `${this.userId}/screenshots/${this.fileName}`;
};
//static method
// TODO: Add joi validation
ScreenshotSchema.statics.joiValidate = function (data) {};

module.exports = mongoose.model('Screenshot', ScreenshotSchema);
