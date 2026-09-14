// Make sure that package.json is properly configured
// and the build output is compatible with CommonJS.
// By checking it with real Node.js loader.

const assert = require('node:assert');

const { RoutingAdapter } = require('@prezly/theme-kit-nextjs');

assert(typeof RoutingAdapter.connect === 'function');

// There was an issue with CommonJS build where default imports would not work properly
const { IntlMiddleware } = require('../build/middleware/index.cjs');

assert(typeof IntlMiddleware.getLocaleCodeFromHeader === 'function');

const deadline = setTimeout(() => {
    console.error('Compiled telemetry fixture did not complete within 10 seconds');
    process.exit(1);
}, 10000);

require('./assert-telemetry.cjs')(
    require('@prezly/theme-kit-nextjs').ContentDelivery,
    require('@prezly/theme-kit-nextjs/server').PrezlyAdapter,
)
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => clearTimeout(deadline));
