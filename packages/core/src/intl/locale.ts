import { isLocaleSupported } from '@prezly/theme-kit-intl';

import type { LocaleObject } from './localeObject';

export const DEFAULT_LOCALE = 'en';

export type LangCode = string;
export type RegionCode = string;
export type LocaleCode = string;

/**
 * Use this function to determine which translations file you should load from `@prezly/theme-kit-intl` package.
 * See https://github.com/prezly/theme-nextjs-bea/blob/main/utils/lang.ts for a usage example.
 */
export function getSupportedLocaleIsoCode(locale: LocaleObject): string {
    const localeIsoCode = locale.toHyphenCode();

    const isSupportedLocale = localeIsoCode.length >= 2 && isLocaleSupported(localeIsoCode);
    if (isSupportedLocale) {
        return localeIsoCode;
    }

    const language = locale.toNeutralLanguageCode();
    if (isLocaleSupported(language)) {
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
