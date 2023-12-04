const fs = require('fs');

const locales = fs
    .readdirSync(__dirname + '/i18n/')
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.slice(0, -'.json'.length))
    .sort();

const [basename] = __filename.split('/').reverse();

process.stdout.write(`
// WARNING: This code is generated by ${basename}. Please do not modify it directly (including formatting).
export const locales: string[] = ${JSON.stringify(locales, undefined, 4)};
`);