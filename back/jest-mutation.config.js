module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '\\..*spec\\.ts$', // All tests (unit + e2e)
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testTimeout: 30000,
};
