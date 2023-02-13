import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { AlternateLanguageLink } from '../components-nextjs/PageSeo';
import type { LocaleObject } from '../intl';
import { getFallbackLocale } from '../intl';

import { bindLanguagesWithLocales } from './utils/bindLanguagesWithLocales';
import { createAlternateLanguageLink } from './utils/createAlternateLanguageLink';

export function getAlternateLanguageLinks(
    availableLanguages: NewsroomLanguageSettings[],
    generateTranslationUrl: (locale: LocaleObject) => string | undefined,
): AlternateLanguageLink[] {
    const languagesWithLocales = bindLanguagesWithLocales(availableLanguages);
    const hrefLangLinks: Array<AlternateLanguageLink> = [];

    function pushLocaleToLinks(locale: LocaleObject, hrefLang?: string) {
        const link = createAlternateLanguageLink(locale, generateTranslationUrl);

        if (!link) {
            return;
        }

        if (hrefLang) {
            hrefLangLinks.push({ ...link, hrefLang });
        } else {
            hrefLangLinks.push(link);
        }
    }

    function populateDirectLinks() {
        languagesWithLocales.forEach((binds) =>
            binds.forEach(({ locale }) => pushLocaleToLinks(locale)),
        );
    }

    function populateGlobalLinks() {
        languagesWithLocales.forEach((binds, globalLocaleCode) => {
            // When there is no global locale of provided locales
            // we still need something as global locale
            const localesArray = Array.from(binds.values()).map(({ locale }) => locale);

            const hasGlobalLocale = localesArray.some((locale) => locale.isGlobal);

            if (hasGlobalLocale) {
                return;
            }

            // Try to find some possible fallback for the globalLocaleCode from hardcoded list
            // We try to find fallback from provided translations of current globalLocaleCode
            // If there is no defined fallback in the list we will use just first translation as a region independent translation
            const fallback =
                getFallbackLocale(globalLocaleCode, localesArray) ?? localesArray.at(0);

            if (fallback) {
                pushLocaleToLinks(fallback, globalLocaleCode);
            }
        });
    }

    function populateDefault() {
        // We use english locale as fallback since English is the most common language
        const engFallback = 'en';
        const defaultHrefLang = 'x-default';

        let isDefaultAddedToLinks = false;

        // First we try to find global english locale (en)
        // If the story has just global `en` translation we will use it as default hreflang
        languagesWithLocales.forEach((binds) =>
            binds.forEach(({ locale }) => {
                if (locale.isGlobal && locale.toNeutralLanguageCode() === engFallback) {
                    pushLocaleToLinks(locale, defaultHrefLang);
                    isDefaultAddedToLinks = true;
                }
            }),
        );

        if (!isDefaultAddedToLinks) {
            // If there is no explicit global `en` translation for this story
            // we will try to find some link that already has `en` fallback
            const fallbackFromGlobalLocales = hrefLangLinks.find(
                (alternate) => alternate.hrefLang === engFallback,
            );

            if (fallbackFromGlobalLocales) {
                hrefLangLinks.push({ ...fallbackFromGlobalLocales, hrefLang: defaultHrefLang });
                isDefaultAddedToLinks = true;
            }
        }

        if (!isDefaultAddedToLinks) {
            // If there is no english locale at all we will use is_default language (provided from server)
            languagesWithLocales.forEach((binds) =>
                binds.forEach(({ locale, language }) => {
                    if (language.is_default) {
                        pushLocaleToLinks(locale, defaultHrefLang);
                        isDefaultAddedToLinks = true;
                    }
                }),
            );
        }
    }

    populateDirectLinks();
    populateGlobalLinks();
    populateDefault();

    return hrefLangLinks.sort((a, b) => a.hrefLang.localeCompare(b.hrefLang));
}
