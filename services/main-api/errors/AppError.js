class AppError extends Error {
  constructor(message = 'App Error', data = {}) {
    super();
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.data = data;
  }
}

module.exports = AppError;