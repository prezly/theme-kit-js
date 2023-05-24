import type { NewsroomLanguageSettings } from '@prezly/sdk';
import {
    getDefaultLanguage,
    getLanguageFromLocaleIsoCode,
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
    const shortRegionCode = locale.toRegionCode();
    const neutralLanguageCode = locale.toNeutralLanguageCode();

    const languageWithSameRegionAndNeutralCode = languages.find(({ code }) => {
        const comparingLocale = LocaleObject.fromAnyCode(code);
        const hasSameNeutralCode = comparingLocale.toNeutralLanguageCode() === neutralLanguageCode;
        const hasSameRegionCode = comparingLocale.toRegionCode() === shortRegionCode;
        return hasSameNeutralCode && hasSameRegionCode;
    });

    if (languageWithSameRegionAndNeutralCode) {
        return languageWithSameRegionAndNeutralCode;
    }

    return getLanguageFromLocaleIsoCode(languages, locale);
}
