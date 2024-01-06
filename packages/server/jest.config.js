module.exports = {
  ...require('../../config/jest.config.base'),
  coverageThreshold: {
    global: {
      // TODO @junjia: set global
      // branches: 100,
      // functions: 100,
      // lines: 100,
      // statements: 100,
    },
  },
};
