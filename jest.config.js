/* eslint-disable eol-last */
/* eslint-disable indent */

module.exports = {
    roots: ['<rootDir>/tests'],
    coverageDirectory: 'coverage',
    moduleNameMapper: {
        '@/tests/(.*)': '<rootDir>/tests/$1',
        '@/(.*)': '<rootDir>/src/$1'
    },
    coveragePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/', 'protocols', 'test'],
    coverageReporters: ['text-summary', 'lcov'],
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