/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Culture, NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

type MinCulture = Pick<Culture, 'code' | 'name' | 'native_name'>;
type MinLanguage = {
    locale: Pick<NewsroomLanguageSettings['locale'], 'code' | 'name' | 'native_name'>;
};

enum Mode {
    NATIVE = 'native',
    ENGLISH = 'english',
}

/**
 * @param subject - the questioned locale/language
 * @param context - the list of displayed locales/languages
 * @param {Mode} mode - defaults to 'native', determines whether to return the native language name or the English language name
 * @returns {string} the display name of the locale in its native language
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
    subject: MinCulture,
    context: MinCulture[],
    mode?: `${Mode}`,
): string;

export function getLanguageDisplayName(
    subject: MinLanguage,
    context: MinLanguage[],
    mode?: `${Mode}`,
): string;

export function getLanguageDisplayName<T extends MinLanguage | MinCulture>(
    subject: T,
    context: T[],
    mode: `${Mode}` = Mode.NATIVE,
): string {
    const locale = toLocale(subject);
    const locales = context.map(toLocale);

    const candidates = locales.filter((candidate) =>
        Locale.isSameLang(candidate.code, locale.code),
    );

    const displayName = mode === Mode.ENGLISH ? locale.name : locale.native_name;

    if (candidates.length === 1) {
        return displayName.replace(/\s*\(.*\)/, '');
    }

    return displayName;
}

function toLocale(value: MinCulture | MinLanguage): MinCulture {
    if ('native_name' in value && 'code' in value) {
        return value;
    }
    return value.locale;
}
