const { Locale } = require('@prezly/theme-kit-intl');

/**
 * This list is pulled from the main Prezly application. The underscores are replaced with dashes.
 * Together with permutation performed lower in the code,
 * the exported list represents all possible locale codes that a theme application might accept.
 */
const locales = require('./localeList');

// Get all permutations for the shorter locale codes supported by Prezly (e.g. short region codes and neutral language codes)
const permutations = Array.from(
    new Set([
        ...locales.map((locale) => Locale.toUrlSlug(locale)),
        ...locales.map((locale) => Locale.toNeutralLanguageCode(locale)),
        ...locales
            .map((locale) => Locale.toRegionCode(locale)?.toLowerCase())
            .filter(Boolean)
            // Remove number-only codes from possible permutations (like `419` for `es-419`)
            .filter((code) => Number.isNaN(Number(code)))
            // Remove codes that are too long to be valid standalone codes (like `hant` for `zh-hant`)
            .filter((code) => code.length <= 3),
    ]),
).sort();

module.exports = permutations;
