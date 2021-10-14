export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  testPathIgnorePatterns: ['/node_modules/', 'build'],
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
}
