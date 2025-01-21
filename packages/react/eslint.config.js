import prezly from '@prezly/eslint-config/nextjs';

export default [
    ...prezly,
    {
        files: ['src/**/*.{ts,tsx,jsx,js,mjs}'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
            },
        },
        rules: {
            'import/no-default-export': 'off',
            'no-restricted-exports': 'off',
            'func-style': 'off',
            'import/no-cycle': 'off',
            'react/jsx-props-no-spreading': 'off',
            'no-underscore-dangle': 'off',
            '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            'react-hooks/exhaustive-deps': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            'react-refresh/only-export-components': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unnecessary-type-constraint': 'off',
        },
    },
    {
        ignores: ['**/*.test.*', '**/__mocks__/*'],
    },
];
