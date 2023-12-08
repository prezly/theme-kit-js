import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Routing } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import { useCallback } from 'react';

import { useCurrentLocale } from './useCurrentLocale';
import { useLanguages } from './useLanguages';

/**
 * Determines correct locale slug for the link (trying to shorten the locale code if possible).
 * E.g. if newsroom has a single locale for Dutch (`nl_BE`), it will be shortened to `nl`.
 * If there are more than one locale with the same language part, a full locale code will be used instead.
 * `false` means that a default locale should be used (no locale in URL required).
 */
function getLinkLocaleSlug(
    languages: NewsroomLanguageSettings[],
    locale: Locale.Code,
): string | false {
    const locales = languages.map((lang) => lang.code);
    const [defaultLocale] = languages.filter((lang) => lang.is_default).map((lang) => lang.code);

    return Routing.getShortestLocaleSlug(locale, {
        locales,
        defaultLocale,
    });
}

export function useGetLinkLocaleSlug() {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();

    // The `locale` parameter is mainly used for Language Dropdown
    return useCallback(
        (locale?: Locale.Code) => getLinkLocaleSlug(languages, locale || currentLocale),
        [languages, currentLocale],
    );
}
