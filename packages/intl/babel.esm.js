module.exports = {
    extends: './babel.base.js',
    targets: {
        esmodules: true,
    },
    presets: [['@babel/env', { modules: false }]],
    plugins: [['babel-plugin-add-import-extension', { extension: 'mjs' }]],
};
