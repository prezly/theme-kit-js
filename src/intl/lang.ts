import type { CultureRef, NewsroomLanguageSettings } from '@prezly/sdk';

function isOnlyCulture(culture: CultureRef, languages: NewsroomLanguageSettings[]): boolean {
    const numberOfLanguages = languages.filter(
        ({ locale: { language_code } }) => language_code === culture.language_code,
    ).length;

    return numberOfLanguages === 1;
}

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
    language: NewsroomLanguageSettings,
    languages: NewsroomLanguageSettings[],
): string {
    const { locale } = language;

    if (isOnlyCulture(locale, languages)) {
        const cultureNameIndex = locale.native_name.indexOf('(');

        if (cultureNameIndex !== -1) {
            return locale.native_name.slice(0, cultureNameIndex - 1);
        }
    }

    return locale.native_name;
}
