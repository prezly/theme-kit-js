/**
 * This list is pulled from the main Prezly application. The underscores are replaced with dashes.
 * Together with permutation performed lower in the code,
 * the exported list represents all of the possible locale codes that Next.js theme application might accept.
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
            // Remove `419` from possible permutations of `es-419`
            .filter((code) => code !== '419'),
    ]),
).sort();

module.exports = lowercaseLocalPermutations;
