import type { LocaleObject } from '../../intl';

export function createAlternateLanguageLink(
    locale: LocaleObject,
    getTranslationUrl: (locale: LocaleObject) => string | undefined,
    createHref: (locale: LocaleObject, translationUrl: string) => string,
) {
    const translationUrl = getTranslationUrl(locale);

    if (!translationUrl) {
        return undefined;
    }

    return {
        hrefLang: locale.toHyphenCode(),
        href: createHref(locale, translationUrl),
    };
}
