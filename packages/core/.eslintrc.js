module.exports = {
    extends: ['@prezly'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
    },
    rules: {},
    ignorePatterns: ['build/'],
    overrides: [
        {
            files: ['**/*.test.*'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
            },
        },
        {
            files: ['**/__mocks__/**'],
            rules: {
                '@typescript-eslint/naming-convention': 'off',
            },
        },
    ],
};
