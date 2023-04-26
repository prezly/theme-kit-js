module.exports = {
    extends: ['@prezly'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
    },
    rules: {
        'import/extensions': [2, 'always', { ignorePackages: true }],
    },
    ignorePatterns: ['build/'],
    overrides: [
        {
            files: ['**/*.test.*'],
            rules: {
                'import/extensions': 'off',
                'import/no-extraneous-dependencies': 'off',
            },
        },
        {
            files: ['**/__mocks__/**'],
            rules: {
                'import/extensions': 'off',
                '@typescript-eslint/naming-convention': 'off',
            },
        },
    ],
};
