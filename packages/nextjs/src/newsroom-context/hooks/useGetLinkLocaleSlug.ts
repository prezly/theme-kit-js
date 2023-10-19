import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { getShortestLocaleSlug, LocaleObject } from '@prezly/theme-kit-core';
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
    locale: LocaleObject,
): string | false {
    const shortestLocaleCode = getShortestLocaleSlug(languages, locale);
    // When navigating to default language, we don't append the locale to the URL.
    if (!shortestLocaleCode) {
        return shortestLocaleCode;
    }

    return LocaleObject.fromAnyCode(shortestLocaleCode).toUrlSlug();
}

export function useGetLinkLocaleSlug() {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();

    // The `locale` parameter is mainly used for Language Dropdown
    return useCallback(
        (locale?: LocaleObject) => getLinkLocaleSlug(languages, locale || currentLocale),
        [languages, currentLocale],
    );
}
