const assert = require('assert');
const { readdirSync } = require('fs');
const { join } = require('path');

const sourceFiles = readdirSync(join(__dirname, '../i18n'))
    .filter((name) => name.endsWith('.json'))
    .sort();
const builtFiles = readdirSync(join(__dirname, '../build/messages'))
    .filter((name) => name.endsWith('.json'))
    .sort();

assert(sourceFiles.length > 0, 'Expected source translation files');
assert.deepStrictEqual(builtFiles, sourceFiles, 'Built translations must match source locales');
