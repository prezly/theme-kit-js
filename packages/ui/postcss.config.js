const path = require('path');

module.exports = {
    plugins: {
        'postcss-import': {
            /**
             * @typedef ImportOptions
             * @property {string} root
             * @property {string[]} path
             * @property {boolean} skipDuplicates
             * @property {Function} resolve
             * @property {Function} load
             * @property {Array} plugins
             * @property {Array} addModulesDirectores
             * @property {boolean} warnOnEmpty
             *
             * @param {string} id
             * @param {string} basedir
             * @param {ImportOptions} importOptions
             */
            resolve(id, basedir, { resolve }) {
                const p = id.endsWith('.css') ? id : `${id}.css`;
                if (p.startsWith('.')) {
                    return path.resolve(basedir, p);
                }
                return require.resolve(p);
            },
        },
        tailwindcss: {},
        autoprefixer: {},
    },
};
