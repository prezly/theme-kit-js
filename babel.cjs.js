module.exports = {
    extends: './babel.base.js',
    targets: {
        esmodules: false,
    },
    presets: [['@babel/env', { modules: 'commonjs' }]],
};
