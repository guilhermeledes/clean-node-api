/* eslint-disable eol-last */
/* eslint-disable indent */
const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/?(*.)+(spec|test).[t]s'],
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
    preset: '@shelf/jest-mongodb',
    transform: tsjPreset.transform
}