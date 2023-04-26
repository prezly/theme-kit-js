module.exports = {
    extends: ['@prezly', '@prezly/eslint-config/react'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
    },
    rules: {
        'import/extensions': [
            2,
            'always',
            {
                ignorePackages: true,
            },
        ],
    },
    ignorePatterns: ['next-env.d.ts', 'build/'],
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
