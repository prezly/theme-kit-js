// Make sure that package.json is properly configured
// and the build output is compatible with CommonJS.
// By checking it with real Node.js loader.

const assert = require('assert');

const { RoutingAdapter } = require('@prezly/theme-kit-nextjs/client');

assert(typeof RoutingAdapter.connect === 'function');

// There was an issue with CommonJS build where default imports would not work properly
const { createRoute } = require('../build/adapters/routing/lib/createRoute.server');

assert(createRoute('/:slug', '/:slug') !== null);
