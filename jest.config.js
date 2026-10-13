module.exports = {
  testEnvironment: 'node',
  // Solo ejecuta archivos *.test.js (ignora *.steps.js y *.feature)
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  // Mide cobertura sobre el codigo fuente, no sobre pruebas ni configuracion
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!scripts/**',
    '!jest.config.js',
    '!**/*.test.js',
    '!**/*.steps.js'
  ]
};
