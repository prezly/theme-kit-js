import type { AlternateLanguageLink } from '../../components-nextjs/PageSeo';
import type { LocaleObject } from '../../intl';

import { createAlternateLanguageLink } from './createAlternateLanguageLink';

export function getDefaultHrefLang(
    localeAlternates: LocaleObject[],
    globalLocalesFallbackLinks: AlternateLanguageLink[],
    defaultLocale: LocaleObject | undefined,
    getTranslationUrl: (locale: LocaleObject) => string | undefined,
    createHref: (locale: LocaleObject, translationUrl: string) => string,
): AlternateLanguageLink | undefined {
    const engFallback = 'en';

    const fallbackFromLocales = localeAlternates.find(
        (alternate) => alternate.isGlobal && alternate.toNeutralLanguageCode() === engFallback,
    );

    if (fallbackFromLocales) {
        const link = createAlternateLanguageLink(
            fallbackFromLocales,
            getTranslationUrl,
            createHref,
        );

        if (link) {
            return { ...link, hrefLang: 'x-default' };
        }
    }

    const fallbackFromGlobalLocales = globalLocalesFallbackLinks.find(
        (alternate) => alternate.hrefLang === engFallback,
    );

    if (fallbackFromGlobalLocales) {
        return { ...fallbackFromGlobalLocales, hrefLang: 'x-default' };
    }

    if (defaultLocale) {
        const link = createAlternateLanguageLink(defaultLocale, getTranslationUrl, createHref);

        if (link) {
            return { ...link, hrefLang: 'x-default' };
        }
    }

    return undefined;
}
