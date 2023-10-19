import { isLocaleSupported, Locale } from '@prezly/theme-kit-intl';

export const DEFAULT_LOCALE = 'en';

/**
 * Use this function to determine which translations file you should load from `@prezly/theme-kit-intl` package.
 * See https://github.com/prezly/theme-nextjs-bea/blob/main/utils/lang.ts for a usage example.
 */
export function getSupportedLocaleIsoCode(locale: Locale | Locale.Code): Locale.IsoCode {
    const { isoCode, lang } = Locale.from(locale);

    if (isLocaleSupported(locale)) {
        return isoCode;
    }

    if (isLocaleSupported(lang)) {
        return lang;
    }

    // Custom mapping for Chinese locales
    if (Locale.isEqual(locale, 'zh_Hant')) {
        return 'zh-TW';
    }
    if (Locale.isEqual(locale, 'zh_HK')) {
        return 'zh-CN';
    }

    console.warn(
        `Unsupported locale provided: "${typeof locale === 'string' ? locale : isoCode}".`,
    );
    return DEFAULT_LOCALE;
}
