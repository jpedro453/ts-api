/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    transform: {
        '.+\\.ts$': 'ts-jest'
    },
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1'
    }
}

export default config
