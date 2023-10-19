import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { getDefaultLanguage, getLanguageFromLocaleSlug } from '@prezly/theme-kit-core';

import { DUMMY_DEFAULT_LOCALE } from './locale';

/**
 * Retrieve a culture with fallback to legacy codes support.
 * Pulled from https://github.com/prezly/prezly/blob/de9900d9890a33502780494aa3fb85c9a732b3c3/lib/model/CulturePeer.php#L91-L114
 */
export function getLanguageFromNextLocaleSlug<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(languages: Language[], localeSlug?: string): Language | undefined {
    const defaultLanguage = getDefaultLanguage(languages);

    if (!localeSlug || localeSlug === DUMMY_DEFAULT_LOCALE) {
        return defaultLanguage;
    }

    return getLanguageFromLocaleSlug(languages, localeSlug);
}
