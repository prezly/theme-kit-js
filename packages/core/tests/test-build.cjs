// Make sure that package.json is properly configured
// and the build output is compatible with CommonJS.
// By checking it with real Node.js loader.

const assert = require('node:assert');

const { ASSETS_CDN_URL, ContentDelivery } = require('@prezly/theme-kit-core');

assert(ASSETS_CDN_URL.startsWith('https://'));
assert(typeof ContentDelivery.getMetricsCollector === 'function');
assert(ContentDelivery.getMetricsCollector('node').render().includes('theme_kit_metrics_info'));
