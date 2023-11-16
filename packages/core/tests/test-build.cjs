// Make sure that package.json is properly configured
// and the build output is compatible with CommonJS.
// By checking it with real Node.js loader.

const assert = require('assert');

const { ASSETS_CDN_URL } = require('@prezly/theme-kit-core');

assert(ASSETS_CDN_URL.startsWith('https://'));
