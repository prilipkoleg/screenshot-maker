'use strict';

const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger');

let options = Object.assign({}, {
  promiseLibrary: Promise,
  useCreateIndex: true,
  useNewUrlParser: true,
}, {});

mongoose.connect(config.db.mongo.url, options);

let isConnected = false; // Readiness status

const connectionPromise = new Promise((resolve, reject) => {
  mongoose.connection.on('connected', function () {
    resolve();
    isConnected = true;
    logger.info('mongoose connected with pid', process.pid);
  });

  mongoose.connection.on('error',function (err) {
    reject();
    isConnected = false;
    logger.info('mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', function () {
    reject();
    isConnected = false;
    logger.info('mongoose disconnected');
  });
});

mongoose.set('debug', config.db.mongo.mongoose.debug);

function testConnection() {
  return new Promise((resolve, reject) => {
    if (!isConnected)return reject();

    mongoose.connection.db.admin()
      .ping((err, result) => (err || !result) ? reject('no ping result') : resolve(true));
  });
}

function disconnect() {
  return new Promise((resolve) => {
    mongoose.connection.close(function () {
      logger.info('mongoose disconnected through app termination pid', process.pid);
      resolve();
    });
  });
}

module.exports.onConnect = connectionPromise;
module.exports.isConnected = testConnection;
module.exports.disconnect = disconnect;
