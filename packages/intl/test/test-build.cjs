// Make sure that package.json is properly configured
// and the build output is compatible with CommonJS.
// By checking it with real Node.js loader.

const assert = require('assert');

const { translations } = require('@prezly/theme-kit-intl');

assert(translations.actions.backToHomePage.id === 'actions.backToHomepage');
