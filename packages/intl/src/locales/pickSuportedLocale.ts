import { DEFAULT_LOCALE } from './constants';
import { isLocaleSupported } from './isLocaleSupported';
import { Locale } from './Locale';

const COUNTRY_TO_LOCALE: Record<string, Locale.IsoCode> = {
    ad: 'ca', // Andorra -> Catalan
    mc: 'fr', // Monaco -> French
    li: 'de', // Liechtenstein -> German
    cy: 'el', // Cyprus -> Greek
    sm: 'it', // San Marino -> Italian
};

/**
 * Use this function to determine which translations file you should load from `@prezly/theme-kit-intl` package.
 * See https://github.com/prezly/theme-nextjs-bea/blob/main/utils/lang.ts for a usage example.
 */
export function pickSupportedLocale(locale: Locale | Locale.AnyCode): Locale.IsoCode {
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

    // Custom mapping for country-only locale slugs
    const countryCode = isoCode.toLowerCase();
    if (countryCode in COUNTRY_TO_LOCALE) {
        return COUNTRY_TO_LOCALE[countryCode as keyof typeof COUNTRY_TO_LOCALE];
    }

    console.warn(
        `Unsupported locale provided: "${typeof locale === 'string' ? locale : isoCode}".`,
    );
    return DEFAULT_LOCALE;
}
