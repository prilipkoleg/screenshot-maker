const uuid = require('uuid/v4');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSessionsSchema = new Schema({
  _id: {
    type: mongoose.SchemaTypes.String,
    default: uuid(),
  },
  userId: {
    type: mongoose.SchemaTypes.String,
    unique: false,
    required: true,
  },
  ip: {
    type : mongoose.SchemaTypes.String,
    unique: false,
    required: true,
  },
  os: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: '',
  },
  browser: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: '',
  },
  userAgent: {
    type: mongoose.SchemaTypes.String,
    required: true,
    default: '',
  },
  refreshToken: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  expiredAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000)
  },
}, {
  collection: 'user_session',
  timestamps: true,
});

UserSessionsSchema.index({ userId: 1, });
UserSessionsSchema.index({ refreshToken: 1,}, { unique: true });
UserSessionsSchema.index({ expiredAt: 1 });
// UserSessionsSchema.index({ _id: 1, userId: 1, refreshToken: 1, expiredAt: 1 }, { unique: true });

//UserSessionsSchema.methods.getPublicFields = function() {};

// TODO: Add joi validation

//static method
UserSessionsSchema.statics.joiValidate = function (data) {};

module.exports = mongoose.model('UserSession', UserSessionsSchema);
