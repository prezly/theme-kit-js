/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    extensionsToTreatAsEsm: ['.ts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
            useESM: true,
        },
    },
};
