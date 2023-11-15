// Make sure that package.json is properly configured
// and the build output is compatible with CommonJS.
// By checking it with real Node.js loader.

const assert = require('assert');

const { useInfiniteLoading } = require('@prezly/theme-kit-nextjs/hooks');

assert(typeof useInfiniteLoading === 'function');
