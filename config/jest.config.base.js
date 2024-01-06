module.exports = {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          throws: false,
          exclude: ['**'],
        },
      },
    ],
  },

  moduleFileExtensions: ['ts', 'js'],

  testMatch: ['<rootDir>/__tests__/**/*.{spec,test}.?(c|m)[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '<rootDir>/lib/'],

  testEnvironment: 'node',
  maxWorkers: '50%',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['typings', 'generated'],

  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  }
};
