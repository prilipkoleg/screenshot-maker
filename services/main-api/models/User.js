const uuid = require('uuid/v4');
const crypto = require('crypto');
// const util = require('util');
const mongoose = require('mongoose');

const { HttpError, codes } = require('../errors').HttpError;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: mongoose.SchemaTypes.String,
    default: uuid,
  },
  username: {
    type: mongoose.SchemaTypes.String,
    unique: true,
    required: true,
  },
  email: {
    type : mongoose.SchemaTypes.String,
    unique: true,
    required: true,
  },
  hashedPassword: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  salt: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
}, {
  collection: 'user',
  timestamps: true,
});

// UserSchema.index({ _id: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1, }, { unique: true });

UserSchema.methods.encryptPassword = (password) => {
  return crypto
    .createHmac('sha1', this.salt)
    .update(password)
    .digest('hex');
};

UserSchema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });


UserSchema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

UserSchema.methods.getPublicFields = function() {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    created: this.created,
  };
};

//static method
UserSchema.statics.authorize = function (email, password) {
  const  User = this;

  return User.findOne({email})
    // .lean()
    .then( user => {
      if (!user || !user.checkPassword(password)) {
        throw new HttpError({statusCode: codes.FORBIDDEN});
      }

      return user;
    });
};
// TODO: Add joi validation
UserSchema.statics.joiValidate = function (data) {};

module.exports = mongoose.model('User', UserSchema);
