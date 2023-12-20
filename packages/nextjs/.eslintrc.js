module.exports = {
    extends: ['@prezly/eslint-config/react'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
    },
    rules: {},
    ignorePatterns: ['next-env.d.ts', 'build/'],
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
