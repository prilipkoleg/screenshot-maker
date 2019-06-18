const winston = require('winston');

const commonOptions = {
  level: 'silly',
  colorize: true,
  handleExceptions: true,
  humanReadableUnhandledException: true,
};

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ ...commonOptions, }),
    // new winston.transports.File({ ...defaultOptions, filename: 'combined.log' })
  ],
  // exitOnError: true,
});

// additional EL
process.on('unhandledRejection', (reason, promise) => {
  logger.error('UnhandledRejection:', reason);
});

module.exports = logger;