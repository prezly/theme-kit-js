import type { AlternateLanguageLink } from '../../components-nextjs/PageSeo';
import type { LocaleObject } from '../../intl';

import { createAlternateLanguageLink } from './createAlternateLanguageLink';

interface Options {
    alternateLanguageLocales: LocaleObject[];
    alternateLanguageFallbackGlobalLinks: AlternateLanguageLink[];
    defaultLangLocale: LocaleObject | undefined;
    generateTranslationUrl: (locale: LocaleObject) => string | undefined;
}

/**
 * This function returns locale that will be used as default hreflang
 */
export function getDefaultHrefLang({
    defaultLangLocale,
    generateTranslationUrl,
    alternateLanguageFallbackGlobalLinks,
    alternateLanguageLocales,
}: Options): AlternateLanguageLink | undefined {
    // We use english locale as fallback since English is the most common language
    const engFallback = 'en';
    const hrefLang = 'x-default';

    // First we try to find global english locale (en)
    // If the story has just global `en` translation we will use it as default hreflang
    const fallbackFromLocales = alternateLanguageLocales.find(
        (alternate) => alternate.isGlobal && alternate.toNeutralLanguageCode() === engFallback,
    );

    if (fallbackFromLocales) {
        const link = createAlternateLanguageLink(fallbackFromLocales, generateTranslationUrl);

        if (link) {
            return { ...link, hrefLang };
        }
    }

    // If there is no explicit global `en` translation for this story
    // we will try to find some link that already has `en` fallback
    const fallbackFromGlobalLocales = alternateLanguageFallbackGlobalLinks.find(
        (alternate) => alternate.hrefLang === engFallback,
    );

    if (fallbackFromGlobalLocales) {
        return { ...fallbackFromGlobalLocales, hrefLang };
    }

    // If there is no english locale at all we will use is_default language (provided from server)
    if (defaultLangLocale) {
        const link = createAlternateLanguageLink(defaultLangLocale, generateTranslationUrl);

        if (link) {
            return { ...link, hrefLang };
        }
    }

    return undefined;
}
