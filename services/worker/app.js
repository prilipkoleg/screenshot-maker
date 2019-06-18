const amqp = require('./common/amqp');
const logger = require('./common/logger');
const mongoDb = require('./common/mongodb');

mongoDb.onConnect
  .then(amqp.start)
  .catch(e => e);

// graceful exit------------------------------------------
function exitHandler(error) {
  if (error) { logger.error(error) }
  logger.info('Exit app!');
  process.exit();
}

//do something when app is closing
// process.on('exit', exitHandler);

//catches ctrl+c event
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);
// -------------------------------------------------------