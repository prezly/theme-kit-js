import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { AlternateLanguageLink } from '../components-nextjs/PageSeo';
import type { LocaleObject } from '../intl';
import { getFallbackLocale } from '../intl';

import { createAlternateLanguageLink } from './utils/createAlternateLanguageLink';
import { getDefaultHrefLang } from './utils/getDefaultHrefLang';
import { mapLanguagesToLocales } from './utils/mapLanguagesToLocales';

export function getAlternateLanguageLinks(
    languages: NewsroomLanguageSettings[],
    getTranslationUrl: (locale: LocaleObject) => string | undefined,
    createHref: (locale: LocaleObject, translationUrl: string) => string,
): AlternateLanguageLink[] {
    const alternateLanguageFallbackGlobalLinks: AlternateLanguageLink[] = [];
    const alternateLanguageLocales: LocaleObject[] = [];
    const [localesByLangCode, defaultLangLocale] = mapLanguagesToLocales(languages);

    localesByLangCode.forEach((locales, globalLocaleCode) => {
        let hasGlobalLocale = false;

        locales.forEach((locale) => {
            alternateLanguageLocales.push(locale);

            if (!hasGlobalLocale && locale.isGlobal) {
                hasGlobalLocale = true;
            }
        });

        // When there is no global locale of provided locales
        // we still need something as global locale
        if (!hasGlobalLocale) {
            const localesArray = Array.from(locales.values());

            // Try to find some possible fallback for the globalLocaleCode from hardcoded list
            // We try to find fallback from provided translations of current globalLocaleCode
            // If there is no defined fallback in the list we will just first translation as a region independent translation
            const fallback =
                getFallbackLocale(globalLocaleCode, localesArray) ?? localesArray.at(0);

            if (fallback) {
                const fallbackLink = createAlternateLanguageLink(
                    fallback,
                    getTranslationUrl,
                    createHref,
                );

                if (fallbackLink) {
                    alternateLanguageFallbackGlobalLinks.push({
                        ...fallbackLink,
                        hrefLang: globalLocaleCode,
                    });
                }
            }
        }
    });

    let languageAlternates: Array<AlternateLanguageLink | undefined> = alternateLanguageLocales.map(
        (locale) => createAlternateLanguageLink(locale, getTranslationUrl, createHref),
    );

    languageAlternates = languageAlternates.concat(alternateLanguageFallbackGlobalLinks);

    const xDefault = getDefaultHrefLang({
        alternateLanguageLocales,
        alternateLanguageFallbackGlobalLinks,
        defaultLangLocale,
        getTranslationUrl,
        createHref,
    });

    languageAlternates.push(xDefault);

    return languageAlternates
        .filter((link): link is Exclude<typeof link, undefined> => Boolean(link))
        .sort((a, b) => a.hrefLang.localeCompare(b.hrefLang));
}
