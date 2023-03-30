import type { LocaleObject } from './localeObject';

export const DEFAULT_LOCALE = 'en';

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

export function getLocaleDirection(locale: LocaleObject): 'ltr' | 'rtl' {
    const neutralLanguageCode = locale.toNeutralLanguageCode();

    if (['ar', 'he', 'ur'].includes(neutralLanguageCode)) {
        return 'rtl';
    }

    return 'ltr';
}
