const assert = require('assert');

const { translations } = require('../dist/cjs/');

assert(translations.actions.backToHomePage.id === 'actions.backToHomepage');
