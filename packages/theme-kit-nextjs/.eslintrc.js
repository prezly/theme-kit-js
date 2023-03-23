module.exports = {
    extends: ['@prezly', '@prezly/eslint-config/react'],
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
    },
    rules: {},
};
