const mockRequire = require('mock-require');

const exp = {
  newTask: {
    screenshot: () => {},
  },
  isConnected: () => true,
  disconnect: () => {},
};


mockRequire('../../common/amqp.js', exp);

module.exports = exp;

