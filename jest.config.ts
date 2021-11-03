import { defaults as tsjPreset } from 'ts-jest/presets'

export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  preset: '@shelf/jest-mongodb',
  transform: tsjPreset.transform
}
