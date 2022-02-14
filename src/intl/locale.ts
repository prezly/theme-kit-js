import type { Redirect } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { stringify } from 'querystring';

import { LocaleObject } from './localeObject';

export const DEFAULT_LOCALE = 'en';
// We use pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
export const DUMMY_DEFAULT_LOCALE = 'qps-ploc';

/**
 * This a list of locales that Prezly has translations for. Each code represents a language file in the `@prezly/themes-intl-messages` package.
 * See https://github.com/prezly/themes-intl-messages for more info.
 */
const SUPPORTED_LOCALES = [
    'af',
    'ar',
    'az',
    'be',
    'bg',
    'cs',
    'da',
    'de',
    'el',
    'en',
    'es',
    'et',
    'fi',
    'fil',
    'fr',
    'ga',
    'he',
    'hi',
    'hr',
    'hu',
    'id',
    'it',
    'ja',
    'kk',
    'ko',
    'lt',
    'lv',
    'mt',
    'nl',
    'no',
    'pl',
    'pt-BR',
    'pt',
    'ro',
    'ru',
    'sk',
    'sl',
    'sv',
    'th',
    'tr',
    'uk',
    'ur',
    'uz',
    'vi',
    'zh-CN',
    'zh-TW',
];

/**
 * Use this function to determine which translations file you should load from `@prezly/themes-intl-mesages` package.
 * See https://github.com/prezly/theme-nextjs-bea/blob/main/utils/lang.ts for a usage example.
 */
export function getSupportedLocaleIsoCode(locale: LocaleObject): string {
    const localeIsoCode = locale.toHyphenCode();

    const isSupportedLocale =
        localeIsoCode.length >= 2 && SUPPORTED_LOCALES.includes(localeIsoCode);
    if (isSupportedLocale) {
        return localeIsoCode;
    }

    const language = localeIsoCode.slice(0, 2);
    const isSupportedLanguage = SUPPORTED_LOCALES.includes(language);
    if (isSupportedLanguage) {
        return language;
    }

    return DEFAULT_LOCALE;
}

export function getRedirectToCanonicalLocale(
    shortestLocaleCode: string | false,
    nextLocaleIsoCode: string | undefined,
    redirectPath: string,
    query?: ParsedUrlQuery,
): Redirect | undefined {
    const shortestLocaleSlug = shortestLocaleCode
        ? LocaleObject.fromAnyCode(shortestLocaleCode).toUrlSlug()
        : shortestLocaleCode;

    if (nextLocaleIsoCode === DUMMY_DEFAULT_LOCALE) {
        return undefined;
    }

    if (shortestLocaleSlug !== nextLocaleIsoCode) {
        const prefixedPath =
            redirectPath && !redirectPath.startsWith('/') ? `/${redirectPath}` : redirectPath;

        const urlQuery = query ? `?${stringify(query)}` : '';

        return {
            destination: shortestLocaleSlug
                ? `/${shortestLocaleSlug}${prefixedPath}${urlQuery}`
                : `${prefixedPath}${urlQuery}`,
            permanent: false,
        };
    }

    return undefined;
}

export function getLocaleDirection(locale: LocaleObject): 'ltr' | 'rtl' {
    const neutralLanguageCode = locale.toNeutralLanguageCode();

    if (['ar', 'he', 'ur'].includes(neutralLanguageCode)) {
        return 'rtl';
    }

    return 'ltr';
}
