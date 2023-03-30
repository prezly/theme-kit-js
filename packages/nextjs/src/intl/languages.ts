import type { NewsroomLanguageSettings } from '@prezly/sdk';
import {
    getDefaultLanguage,
    getLanguageByExactLocaleCode,
    getLanguageByNeutralLocaleCode,
    getLanguageByShortRegionCode,
    LocaleObject,
} from '@prezly/theme-kit-core';

import { DUMMY_DEFAULT_LOCALE } from './locale';

/**
 * Retrieve a culture with fallback to legacy codes support.
 * Pulled from https://github.com/prezly/prezly/blob/de9900d9890a33502780494aa3fb85c9a732b3c3/lib/model/CulturePeer.php#L91-L114
 */
export function getLanguageFromNextLocaleIsoCode(
    languages: NewsroomLanguageSettings[],
    nextLocaleIsoCode?: string,
): NewsroomLanguageSettings | undefined {
    const defaultLanguage = getDefaultLanguage(languages);

    if (!nextLocaleIsoCode || nextLocaleIsoCode === DUMMY_DEFAULT_LOCALE) {
        return defaultLanguage;
    }

    const locale = LocaleObject.fromAnyCode(nextLocaleIsoCode);
    let targetLanguage: NewsroomLanguageSettings | undefined;

    if (nextLocaleIsoCode.length >= 2 && nextLocaleIsoCode.length <= 4) {
        // The order of methods here is reversed from `getShortestLocaleCode`, so that the logic "unwraps" the possible variants with no collisions
        targetLanguage =
            getLanguageByExactLocaleCode(languages, locale) ||
            getLanguageByShortRegionCode(languages, locale) ||
            getLanguageByNeutralLocaleCode(languages, locale);
    } else {
        targetLanguage = getLanguageByExactLocaleCode(languages, locale);
    }

    return targetLanguage;
}
