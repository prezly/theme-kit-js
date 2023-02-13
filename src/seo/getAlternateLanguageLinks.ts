import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { AlternateLanguageLink } from '../components-nextjs/PageSeo';
import { getFallbackLocale, LocaleObject } from '../intl';

import { createAlternateLanguageLink } from './utils/createAlternateLanguageLink';
import { getDefaultHrefLang } from './utils/getDefaultHrefLang';
import { mapLanguagesToLocales } from './utils/mapLanguagesToLocales';

export function getAlternateLanguageLinks(
    languages: NewsroomLanguageSettings[],
    generateTranslationUrl: (locale: LocaleObject) => string | undefined,
): AlternateLanguageLink[] {
    const alternateLanguageFallbackGlobalLinks: AlternateLanguageLink[] = [];
    const alternateLanguageLocales: LocaleObject[] = [];
    const localesByLangCode = mapLanguagesToLocales(languages);

    const defaultLanguage = languages.find((language) => language.is_default);
    const defaultLangLocale = defaultLanguage
        ? LocaleObject.fromAnyCode(defaultLanguage.code)
        : undefined;

    localesByLangCode.forEach((locales, globalLocaleCode) => {
        const hasGlobalLocale = Array.from(locales).some(([_, locale]) => locale.isGlobal);

        locales.forEach((locale) => {
            alternateLanguageLocales.push(locale);
        });

        // When there is no global locale of provided locales
        // we still need something as global locale
        if (!hasGlobalLocale) {
            const localesArray = Array.from(locales.values());

            // Try to find some possible fallback for the globalLocaleCode from hardcoded list
            // We try to find fallback from provided translations of current globalLocaleCode
            // If there is no defined fallback in the list we will use just first translation as a region independent translation
            const fallback =
                getFallbackLocale(globalLocaleCode, localesArray) ?? localesArray.at(0);

            if (fallback) {
                const fallbackLink = createAlternateLanguageLink(fallback, generateTranslationUrl);

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
        (locale) => createAlternateLanguageLink(locale, generateTranslationUrl),
    );

    languageAlternates = languageAlternates.concat(alternateLanguageFallbackGlobalLinks);

    const xDefault = getDefaultHrefLang({
        alternateLanguageLocales,
        alternateLanguageFallbackGlobalLinks,
        defaultLangLocale,
        generateTranslationUrl,
    });

    languageAlternates.push(xDefault);

    return languageAlternates
        .filter((link): link is Exclude<typeof link, undefined> => Boolean(link))
        .sort((a, b) => a.hrefLang.localeCompare(b.hrefLang));
}
