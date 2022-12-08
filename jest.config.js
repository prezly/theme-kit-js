/** @type {import('ts-jest').InitialOptionsTsJest} */
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
