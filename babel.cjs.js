module.exports = {
    extends: './babel.base.js',
    targets: {
        esmodules: false,
    },
    presets: [['@babel/env', { modules: 'commonjs' }]],
    plugins: [
        ['@babel/plugin-transform-modules-commonjs', { importInterop: 'none', strict: true }],
    ],
};
