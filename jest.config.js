module.exports = {
  // Entorno de pruebas
  testEnvironment: 'jsdom',
  
  // Directorios donde buscar tests
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Directorios a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  
  // Configuración de módulos
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Configuración de coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js',
    '!src/main.jsx'
  ],
  
  // Umbrales de coverage
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Configuración de transformaciones
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Configuración de Babel
  transformIgnorePatterns: [
    '/node_modules/(?!(@babel/runtime)/)'
  ],
  
  // Configuración de módulos ES6
  extensionsToTreatAsEsm: ['.js', '.jsx'],
  
  // Configuración de globals
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
}; 