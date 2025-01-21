import type { Culture, NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

type MinCulture = Pick<Culture, 'code' | 'native_name'>;
type MinLanguage = { locale: Pick<NewsroomLanguageSettings['locale'], 'code' | 'native_name'> };

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
export function getLanguageDisplayName(subject: MinCulture, context: MinCulture[]): string;

export function getLanguageDisplayName(subject: MinLanguage, context: MinLanguage[]): string;

export function getLanguageDisplayName<T extends MinLanguage | MinCulture>(
    subject: T,
    context: T[],
): string {
    const locale = toLocale(subject);
    const locales = context.map(toLocale);

    const candidates = locales.filter((candidate) =>
        Locale.isSameLang(candidate.code, locale.code),
    );

    if (candidates.length === 1) {
        return locale.native_name.replace(/\s*\(.*\)/, '');
    }

    return locale.native_name;
}

function toLocale(value: MinCulture | MinLanguage): MinCulture {
    if ('native_name' in value && 'code' in value) {
        return value;
    }
    return value.locale;
}
