const amqpApi = require('amqplib/callback_api');

const { amqp } = require('../config');
const logger = require('./logger');
const taskHandler = require('../services/taskHandler');

const RECONNECTION_TIMEOUT = 2000;
// if the connection is closed or fails to be established at all, we will reconnect
let amqpConn = null;
let isConnected = false;
let reconnectOnClose = true;

function start() {
  const amqpUrl = `${amqp.url}?heartbeat=60`;

  amqpApi
    .connect(
      amqpUrl,
      (err, conn) => {
        if (err) {
          logger.error('[AMQP]', err.message);
          isConnected = false;
          return reconnect();
        }
        // connection event listeners
        conn.on('error', (err) => {
          if (err.message !== 'Connection closing') {
            logger.error('[AMQP] conn error', err.message);
          }
        });
        conn.on('close', () => {
          if (!reconnectOnClose) return;
          logger.error('[AMQP] reconnecting');
          isConnected = false;
          return reconnect();
        });

        logger.info('[AMQP] connected');
        isConnected = true;
        amqpConn = conn;

        // create channel
        amqpConn
          .createChannel(
            (err, ch) => {
              if (closeOnErr(err)) return;

              ch.on('error', function(err) { console.error('[AMQP] channel error', err.message); });
              ch.on('close', function() { console.log('[AMQP] channel closed'); });

              ch.prefetch(amqp.queue.screenshots.prefetchCount);

              // create queue
              ch.assertQueue(
                amqp.queue.screenshots.name,
                amqp.queue.screenshots.options,
                (err, _ok) => {
                  if (closeOnErr(err)) return;
                  ch.consume(
                    amqp.queue.screenshots.name,
                    processMsg,
                    { noAck: false }
                  );
                  logger.info('[Worker] started and waiting for tasks');
                }
              );

              function processMsg(msg) {
                let task = JSON.parse(msg.content.toString());

                logger.info('[Worker] Task received:', task);

                taskHandler(task, workerCallback);

                function workerCallback(err) {
                  if (!err){
                    return ch.ack(msg);
                  } else {
                    let requeue = false;
                    logger.error('AMQP task Err:', err);
                    if(/Screenshot timed out/i.test(err) || /navigation timeout/i.test(err)) {
                      requeue = true;
                      console.error('!!!Requeue by \'navigation timeout\'!!!');
                    }
                    return ch.reject(msg, requeue);
                  }
                }

              }

            }
          ); // end of create channel

      }
    );
}

function reconnect() {
  setTimeout(start, RECONNECTION_TIMEOUT);
}

function disconnect() {
  return new Promise(resolve => {
    reconnectOnClose = false;
    return amqpConn
      ? amqpConn.close(() => {
        logger.info('[AMQP] closed');
        resolve(true);
      })
      : resolve(true);
  })
}

function closeOnErr(err) {
  if (!err) return false;
  logger.error('[AMQP] create channel error', err);
  amqpConn.close();
  return true;
}

module.exports = {
  start,
  isConnected: () => isConnected,
  disconnect,
};
