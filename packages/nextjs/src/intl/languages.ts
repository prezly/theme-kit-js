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
export function getLanguageFromNextLocaleIsoCode<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(languages: Language[], nextLocaleIsoCode?: string): Language | undefined {
    const defaultLanguage = getDefaultLanguage(languages);

    if (!nextLocaleIsoCode || nextLocaleIsoCode === DUMMY_DEFAULT_LOCALE) {
        return defaultLanguage;
    }

    const locale = LocaleObject.fromAnyCode(nextLocaleIsoCode);
    let targetLanguage: Language | undefined;

    if (nextLocaleIsoCode.length >= 2 && nextLocaleIsoCode.length <= 4) {
        const languageByExactLocaleCode = getLanguageByExactLocaleCode(languages, locale);
        const languageByNeutralLocaleCode = getLanguageByNeutralLocaleCode(languages, locale);
        const languageByShortRegionCode = getLanguageByShortRegionCode(languages, locale);

        if (languageByExactLocaleCode) {
            targetLanguage = languageByExactLocaleCode;
        } else if (languageByNeutralLocaleCode && languageByShortRegionCode) {
            // e.g: nl and nl_NL
            if (
                locale.toNeutralLanguageCode() ===
                LocaleObject.fromAnyCode(languageByShortRegionCode.code).toNeutralLanguageCode()
            ) {
                targetLanguage = languageByShortRegionCode;
            }
            // e.g: de and en_DE
            else {
                targetLanguage = languageByNeutralLocaleCode;
            }
        } else if (languageByNeutralLocaleCode && !languageByShortRegionCode) {
            targetLanguage = languageByNeutralLocaleCode;
        } else if (languageByShortRegionCode && !languageByNeutralLocaleCode) {
            targetLanguage = languageByShortRegionCode;
        }
    } else {
        targetLanguage = getLanguageByExactLocaleCode(languages, locale);
    }

    return targetLanguage;
}
