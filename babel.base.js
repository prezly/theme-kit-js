module.exports = function (api) {
    const isDevelopment = process.env.NODE_ENV === 'development';

    api.cache(isDevelopment);

    return {
        targets: {
            esmodules: false,
            node: '12',
        },

        presets: [
            '@babel/typescript',
            '@babel/env',
        ],
    };
};
