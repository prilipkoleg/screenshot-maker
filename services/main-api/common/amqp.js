'use strict';

const uuid = require('uuid/v4');
const amqpApi = require('amqplib/callback_api');

const logger = require('./logger');
const { amqp } = require('../config');

const RECONNECTION_TIMEOUT = 1000;

// if the connection is closed or fails to be established at all, we will reconnect
let amqpConn = null;
let pubChannel = null;
let isConnected = false;
let reconnectOnClose = true;

// createConnection();

module.exports = {
  newTask: {
    screenshot: sendTask.bind(null, amqp.queue.screenshots.name),
  },
  start: createConnection,
  isConnected: () => isConnected,
  disconnect: disconnect,
};

function createConnection() {
  const amqpUrl = `${amqp.url}?heartbeat=60`;

  // create connection:
  amqpApi
    .connect(
      amqpUrl,
      (err, conn) => {
        if (err) {
          logger.error('AMQP', err.message);
          isConnected = false;
          return setTimeout(createConnection, RECONNECTION_TIMEOUT);
        }
        conn.on('error', (err) => {
          if (err.message !== 'Connection closing') {
            logger.error('[AMQP] conn error', err.message);
          }
        });
        conn.on('close', () => {
          if (!reconnectOnClose) return;
          logger.error('AMQP reconnecting');
          isConnected = false;
          return setTimeout(createConnection, RECONNECTION_TIMEOUT);
        });

        logger.info('AMQP connected');
        isConnected = true;
        amqpConn = conn;

        // create channel:
        amqpConn.createConfirmChannel((err, ch) => {
          if (closeOnErr(err)) return;
          ch.on('error', (err) => { logger.error('AMQP channel error', err.message); });
          ch.on('close', () => { logger.info('AMQP channel closed'); });
          pubChannel = ch;
        });
      }
    );
}

function sendTask(queue, taskMsg) {
  try {
    taskMsg.taskId = taskMsg.taskId || uuid(); // for identify it in worker

    const msgInBuffer = new Buffer(JSON.stringify(taskMsg));
    const queueOptionsDefault = { persistent: true, };
    const queueOptions = taskMsg.priority
      ? Object.assign({}, queueOptionsDefault, { priority: taskMsg.priority })
      : queueOptionsDefault;

    pubChannel.publish('', queue, msgInBuffer, queueOptions,
      (err, ok) => {
        if (err) {
          logger.error('AMQP publish', err);
          return pubChannel.connection.close();
        }
        logger.info('AMQP task send', taskMsg);
      });
  } catch (err) {
    logger.error('AMQP publish', err.message);
  }
}

function disconnect() {
  return new Promise(resolve => {
    reconnectOnClose = false;
    return amqpConn
      ? amqpConn.close(() => {
        logger.info('[AMQP] closed');
        resolve(true)
      })
      : resolve(true);
  })
}

function closeOnErr(err) {
  if (!err) return false;
  logger.error('AMQP create channel error', err);
  amqpConn.close();
  return true;
}
