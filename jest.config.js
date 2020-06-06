module.exports = {
  preset: 'ts-jest',
  // verbose: true,
  // collectCoverage: true,
  // coverageReporters: ['text', 'json', 'html'],
  // coverageReporters: ['html'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
}
