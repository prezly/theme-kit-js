// Make sure that package.json is properly configured
// and the build output is compliant with the ES Modules spec.
//
// The easiest way to check ESM compatibility is
// by running it through the Node.js ESM implementation.
//
// @see https://nodejs.org/api/esm.html
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

import assert from 'assert';

import { translations } from '@prezly/themes-intl-messages';

assert(translations.actions.backToHomePage.id === 'actions.backToHomepage');
