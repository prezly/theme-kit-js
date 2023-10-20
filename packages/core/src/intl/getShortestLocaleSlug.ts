/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

import { getDefaultLanguage, isNumberCode } from './languages';

/**
 * Get the shortest locale code possible from full locale code
 * First: try shorting to neutral language code (there should be no locales with the same language code)
 * Then: try shorting to region code (there should be no locales with the same region code)
 * Finally: return the original locale code (shorting is not possible)
 */
export function getShortestLocaleSlug<
    Language extends Pick<NewsroomLanguageSettings, 'code' | 'is_default'>,
>(languages: Language[], locale: Locale | Locale.AnyCode): Locale.AnySlug | false {
    const {
        code: localeCode,
        lang: langCode,
        region: regionCode,
        slug: localeSlug,
    } = Locale.from(locale);

    const defaultLanguage = getDefaultLanguage(languages);
    // If it's a default locale, return false (no locale needed in URL)
    if (localeCode === defaultLanguage.code) {
        return false;
    }

    return (
        // Try shortening to neutral language code
        (
            getUnambiguousLangCode(languages, langCode) ??
            // Try shortening to region code
            getUnambiguousRegionCode(languages, regionCode) ??
            // Return the original (exact) code if shortening is not possible
            localeSlug
        ).toLowerCase()
    );
}

function getUnambiguousLangCode<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    langCode: Locale.LanguageCode,
) {
    const candidates = languages.filter((lang) => Locale.isLanguageCode(lang.code, langCode));

    if (candidates.length === 1) {
        return langCode;
    }

    return undefined;
}

function getUnambiguousRegionCode<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    regionCode: Locale.RegionCode | undefined,
) {
    if (!regionCode) {
        return undefined;
    }

    if (isNumberCode(regionCode)) {
        // We don't want just numbers in our region code
        return undefined;
    }

    const candidates = languages.filter((lang) => Locale.isRegionCode(lang.code, regionCode));
    // Prevent collision with neutral language codes
    const collisions = languages.filter((lang) =>
        Locale.isLanguageCode(lang.code, regionCode.toLowerCase()),
    );

    if (candidates.length === 1 && collisions.length === 0) {
        return regionCode;
    }

    return undefined;
}
