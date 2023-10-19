import type { Locale } from '@prezly/theme-kit-intl';

export function createAlternateLanguageLink(
    locale: Locale,
    generateTranslationUrl: (locale: Locale) => string | undefined,
) {
    const translationUrl = generateTranslationUrl(locale);

    if (!translationUrl) {
        return undefined;
    }

    return {
        hrefLang: locale.isoCode,
        href: translationUrl,
    };
}
