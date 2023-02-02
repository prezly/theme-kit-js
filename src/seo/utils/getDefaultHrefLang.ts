import type { AlternateLanguageLink } from '../../components-nextjs/PageSeo';
import type { LocaleObject } from '../../intl';

import { createAlternateLanguageLink } from './createAlternateLanguageLink';

interface Options {
    alternateLanguageLocales: LocaleObject[];
    alternateLanguageFallbackGlobalLinks: AlternateLanguageLink[];
    defaultLangLocale: LocaleObject | undefined;
    getTranslationUrl: (locale: LocaleObject) => string | undefined;
    createHref: (locale: LocaleObject, translationUrl: string) => string;
}

export function getDefaultHrefLang({
    createHref,
    defaultLangLocale,
    getTranslationUrl,
    alternateLanguageFallbackGlobalLinks,
    alternateLanguageLocales,
}: Options): AlternateLanguageLink | undefined {
    const engFallback = 'en';
    const hrefLang = 'x-default';

    const fallbackFromLocales = alternateLanguageLocales.find(
        (alternate) => alternate.isGlobal && alternate.toNeutralLanguageCode() === engFallback,
    );

    if (fallbackFromLocales) {
        const link = createAlternateLanguageLink(
            fallbackFromLocales,
            getTranslationUrl,
            createHref,
        );

        if (link) {
            return { ...link, hrefLang };
        }
    }

    const fallbackFromGlobalLocales = alternateLanguageFallbackGlobalLinks.find(
        (alternate) => alternate.hrefLang === engFallback,
    );

    if (fallbackFromGlobalLocales) {
        return { ...fallbackFromGlobalLocales, hrefLang };
    }

    if (defaultLangLocale) {
        const link = createAlternateLanguageLink(defaultLangLocale, getTranslationUrl, createHref);

        if (link) {
            return { ...link, hrefLang };
        }
    }

    return undefined;
}
