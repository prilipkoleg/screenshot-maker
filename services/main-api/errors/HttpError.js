const httpCodes = require('http-status-codes');
const AppError = require('./AppError');

class HttpError extends AppError {
  constructor({
      statusCode = 500,
      message = httpCodes.getStatusText(statusCode),
      data = {}
    }) {
    super(message, data);
    this.statusCode = statusCode;
  }
}

const jwtAdapter = error => {
  if (
    ('name' in error)
    && ['UnauthorizedError', 'JsonWebTokenError'].includes(error.name)
  ) {
    const statusCode =
      //('inner' in error) && error.inner.name === 'TokenExpiredError' && 498 ||
      error.status
      || httpCodes.UNAUTHORIZED;
    return new HttpError({
      statusCode: statusCode,
      message: error.message,
      data: { originError: error },
    });
  }

  return error;
};

module.exports = {
  HttpError,
  codes: httpCodes,

  adapter: {
    jwt: jwtAdapter,
  }
};