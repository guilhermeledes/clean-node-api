/* eslint-disable eol-last */
/* eslint-disable indent */
module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/?(*.)+(spec|test).[t]s'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
    preset: '@shelf/jest-mongodb',
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main/**'
    ],
    coverageProvider: 'babel',
    testEnvironment: 'node',
    transform: {
        '.+\\.ts$': 'ts-jest'
    }
}