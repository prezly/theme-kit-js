/* eslint-disable @typescript-eslint/no-use-before-define */
import { Locale } from '@prezly/theme-kit-intl';

import { isNumberCode } from './isNumberCode';

/**
 * Get the shortest locale code possible from full locale code
 * First: try shorting to neutral language code (there should be no locales with the same language code)
 * Then: try shorting to region code (there should be no locales with the same region code)
 * Finally: return the original locale code (shorting is not possible)
 */
export function getShortestLocaleSlug(
    locale: Locale.Code,
    context: {
        locales: Locale.Code[];
        defaultLocale: Locale.Code;
    },
): Locale.AnySlug | false {
    const {
        code: localeCode,
        lang: langCode,
        region: regionCode,
        slug: localeSlug,
    } = Locale.from(locale);

    // If it's a default locale, return false (no locale needed in URL)
    if (localeCode === context.defaultLocale) {
        return false;
    }

    const shortened =
        // Try shortening to neutral language code
        getUnambiguousLangCode(langCode, context) ??
        // Try shortening to region code
        getUnambiguousRegionCode(regionCode, context) ??
        // Return the original (exact) code if shortening is not possible
        localeSlug;

    return shortened.toLowerCase();
}

function getUnambiguousLangCode(langCode: Locale.LangCode, context: { locales: Locale.Code[] }) {
    const candidates = context.locales.filter((code) => Locale.isLanguageCode(code, langCode));

    if (candidates.length === 1) {
        return langCode;
    }

    return undefined;
}

function getUnambiguousRegionCode(
    regionCode: Locale.RegionCode | undefined,
    context: { locales: Locale.Code[] },
) {
    if (!regionCode) {
        return undefined;
    }

    if (isNumberCode(regionCode)) {
        // We don't want just numbers in our region code
        return undefined;
    }

    const candidates = context.locales.filter((locale) => Locale.isRegionCode(locale, regionCode));
    // Prevent collision with neutral language codes
    const collisions = context.locales.filter((locale) =>
        Locale.isLanguageCode(locale, regionCode.toLowerCase() as Locale.LangCode),
    );

    if (candidates.length === 1 && collisions.length === 0) {
        return regionCode;
    }

    return undefined;
}
