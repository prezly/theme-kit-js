import type { LocaleObject } from '../../intl';

export function createAlternateLanguageLink(
    locale: LocaleObject,
    generateTranslationUrl: (locale: LocaleObject) => string | undefined,
) {
    const translationUrl = generateTranslationUrl(locale);

    if (!translationUrl) {
        return undefined;
    }

    return {
        hrefLang: locale.toHyphenCode(),
        href: translationUrl,
    };
}
