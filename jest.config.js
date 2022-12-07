/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    collectCoverage: true,
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
            useESM: true,
        },
    },
};
