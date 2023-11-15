// Make sure that package.json is properly configured
// and the build output is compatible with CommonJS.
// By checking it with real Node.js loader.

const assert = require('assert');

const { HttpClient } = require('@prezly/theme-kit-nextjs/http');

assert(typeof HttpClient.create === 'function');
