import { getShortestLocaleSlug } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import { useCallback } from 'react';

import { useCurrentLocale } from './useCurrentLocale';
import { useLanguages } from './useLanguages';

export function useGetLinkLocaleSlug() {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();

    // The `locale` parameter is mainly used for Language Dropdown
    return useCallback(
        (locale?: Locale.Code) => getShortestLocaleSlug(languages, locale ?? currentLocale.code),
        [languages, currentLocale],
    );
}
