/**
 * This list is pulled from the main Prezly application. The underscores are replaced with dashes.
 * Together with permutation performed lower in the code,
 * the exported list represents all of the possible locale codes that Next.js theme application might accept.
 */
import { localeList } from './localeList';

const lowercaseLocales = localeList.map((l) => l.toLowerCase());

// We use pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
export const DUMMY_DEFAULT_LOCALE = 'qps-ploc';

// Get all permutations for the shorter locale codes supported by Prezly (e.g. short region codes and neutral language codes)
const lowercaseLocalPermutations = Array.from(
    new Set([
        ...DUMMY_DEFAULT_LOCALE,
        ...lowercaseLocales,
        ...lowercaseLocales.map((code) => code.split('-')[0]),
        ...lowercaseLocales
            .map((code) => code.split('-')[1])
            .filter(Boolean)
            // Remove number-only codes from possible permutations (like `419` for `es-419`)
            .filter((code) => Number.isNaN(Number(code))),
    ]),
).sort();

export const localeConfig = lowercaseLocalPermutations;
