import type { Redirect } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { stringify } from 'querystring';

import { LocaleObject } from './localeObject';

export const DEFAULT_LOCALE = 'en';
// We use pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
export const DUMMY_DEFAULT_LOCALE = 'qps-ploc';

export type LangCode = string;
export type RegionCode = string;
export type LocaleCode = string;

/**
 * This a list of locales that Prezly has translations for. Each code represents a language file in the `@prezly/themes-intl-messages` package.
 * See https://github.com/prezly/themes-intl-messages for more info.
 */
const SUPPORTED_LOCALES: LocaleCode[] = [
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
    'sw',
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

    const language = locale.toNeutralLanguageCode();
    const isSupportedLanguage = SUPPORTED_LOCALES.includes(language);
    if (isSupportedLanguage) {
        return language;
    }

    // Custom mapping for Chinese locales
    if (localeIsoCode.toLowerCase() === 'zh-hant') {
        return 'zh-TW';
    }
    if (localeIsoCode.toLowerCase() === 'zh-hk') {
        return 'zh-CN';
    }

    // This code should never be reached, because locale code check is happening in `LocaleObject.fromAnyCode`
    // eslint-disable-next-line no-console
    console.warn(
        'Unsupported locale provided. Please use `LocaleObject.fromAnyCode` to ensure you are using a correct language code',
    );
    return DEFAULT_LOCALE;
}

export function getRedirectToCanonicalLocale(
    shortestLocaleCode: string | false,
    nextLocaleIsoCode: string | undefined,
    redirectPath: string,
    query?: ParsedUrlQuery,
): Redirect | undefined {
    // No need to redirect if no particular locale was requested by the application
    if (!nextLocaleIsoCode || nextLocaleIsoCode === DUMMY_DEFAULT_LOCALE) {
        return undefined;
    }

    const shortestLocaleSlug = shortestLocaleCode
        ? LocaleObject.fromAnyCode(shortestLocaleCode).toUrlSlug()
        : shortestLocaleCode;

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
