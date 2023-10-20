module.exports = {
    extends: ['@prezly', '@prezly/eslint-config/react'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: ['next-env.d.ts', 'build/', 'tailwind.config.js', 'postcss.config.js'],
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
        {
            files: ['**/*.stories.*'],
            rules: {
                'import/no-default-export': 'off',
            },
        },
    ],
};
