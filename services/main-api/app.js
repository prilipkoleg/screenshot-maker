const cors = require('cors');
const express = require('express');
const morganLogger = require('morgan');
const cookieParser = require('cookie-parser');

const config = require('./config');
const logger = require('./common/logger');
const mongodb = require('./common/mongodb');
const amqp = require('./common/amqp');
const { HttpError, codes } = require('./errors').HttpError;
const initRouters = require('./routes');


mongodb
  .onConnect
  .then(amqp.start)
  .catch(e => e);

const app = express();

app.set('trust proxy', 1);
app.set('x-powered-by', false);

if (config.loggerEnabled) {
  app.use(morganLogger('dev'));
}
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

initRouters(app);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new HttpError({statusCode: codes.NOT_FOUND})) );

// error handler
app.use((error, req, res, next) => {
  let resultError = error;

  if (!(error instanceof HttpError)) {
    logger.error(error);
    resultError = new HttpError({data: { originError: { message: error.message, instance: error }}});
  }

  res.status(resultError.statusCode);
  res.send(config.env === 'production' && resultError.message || resultError);
});


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

module.exports = app;
