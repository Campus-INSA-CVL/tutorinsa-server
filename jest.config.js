module.exports = {
  preset: 'ts-jest',
  // verbose: true,
  // collectCoverage: true,
  coverageReporters: ['text', 'json', 'html'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
