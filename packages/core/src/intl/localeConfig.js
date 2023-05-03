/**
 * This list is pulled from the main Prezly application. The underscores are replaced with dashes.
 * Together with permutation performed lower in the code,
 * the exported list represents all of the possible locale codes that a theme application might accept.
 */
const supportedLocales = require('./localeList');

const lowercaseLocales = supportedLocales.map((l) => l.toLowerCase());

// Get all permutations for the shorter locale codes supported by Prezly (e.g. short region codes and neutral language codes)
const lowercaseLocalPermutations = Array.from(
    new Set([
        ...lowercaseLocales,
        ...lowercaseLocales.map((code) => code.split('-')[0]),
        ...lowercaseLocales
            .map((code) => code.split('-')[1])
            .filter(Boolean)
            // Remove number-only codes from possible permutations (like `419` for `es-419`)
            .filter((code) => Number.isNaN(Number(code)))
            // Remove codes that are too long to be valid standalone codes (like `hant` for `zh-hant`)
            .filter((code) => code.length <= 3),
    ]),
).sort();

module.exports = lowercaseLocalPermutations;
