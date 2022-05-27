/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
        },
    },
};
