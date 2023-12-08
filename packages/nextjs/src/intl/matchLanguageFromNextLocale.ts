import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Routing } from '@prezly/theme-kit-core';

import { DUMMY_DEFAULT_LOCALE } from './getRedirectToCanonicalLocale';

/**
 * Retrieve a culture with fallback to legacy codes support.
 * Pulled from https://github.com/prezly/prezly/blob/de9900d9890a33502780494aa3fb85c9a732b3c3/lib/model/CulturePeer.php#L91-L114
 */
export function matchLanguageFromNextLocale<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(nextLocale: string | undefined, languages: Language[]): Language | undefined {
    if (!nextLocale || nextLocale === DUMMY_DEFAULT_LOCALE) {
        return languages.find((lang) => lang.is_default);
    }

    return Routing.matchLanguageByLocaleSlug(languages, nextLocale);
}
