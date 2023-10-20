import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

/**
 * @returns the display name of the locale in its native language
 *
 * If there's only one culture used in a specific language,
 * we strip the culture name completely.
 *
 * Examples:
 *  - English (Global), Spanish (Spain)
 *  - -> English, Spanish
 *  - English (Global), English (UK), Spanish (Spain)
 *  - -> English (Global), English (UK), Spanish
 */
export function getLanguageDisplayName(
    language: Pick<NewsroomLanguageSettings, 'locale'>,
    languages: Pick<NewsroomLanguageSettings, 'locale'>[],
): string {
    const localeCode = language.locale.code;

    const candidates = languages.filter((lang) => Locale.isSameLang(lang.locale.code, localeCode));

    if (candidates.length === 1) {
        return language.locale.native_name.replace(/\s*\(.*/, '');
    }

    return language.locale.native_name;
}
