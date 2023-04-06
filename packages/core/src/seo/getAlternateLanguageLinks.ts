import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { LocaleObject } from '../intl';
import { getFallbackLocale } from '../intl';

import type { AlternateLanguageLink } from './types';
import { bindLanguagesWithLocales, createAlternateLanguageLink } from './utils';

// We use english locale as fallback since English is the most common language
const ENG_FALLBACK = 'en';
const DEFAULT_HREF_LANG = 'x-default';

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

    function populateRegionIndependentLinks() {
        languagesWithLocales.forEach((binds, regionIndependentLocaleCode) => {
            // When there is no region independent locale of provided locales
            // we still need something as a region independent locale
            const localesArray = Array.from(binds.values()).map(({ locale }) => locale);

            const hasRegionIndependentLocale = localesArray.some(
                (locale) => locale.isRegionIndependent,
            );

            if (hasRegionIndependentLocale) {
                return;
            }

            // Try to find some possible fallback for the regionIndependentLocaleCode from hardcoded list
            // We try to find fallback from provided translations of current regionIndependentLocaleCode
            // If there is no defined fallback in the list we will use just first translation as a region independent translation
            const fallback =
                getFallbackLocale(regionIndependentLocaleCode, localesArray) ?? localesArray.at(0);

            if (fallback) {
                pushLocaleToLinks(fallback, regionIndependentLocaleCode);
            }
        });
    }

    function populateDefault() {
        let isDefaultAddedToLinks = false;

        // First we try to find region independent english locale (en)
        // If the story has just region independent `en` translation we will use it as default hreflang
        languagesWithLocales.forEach((binds) =>
            binds.forEach(({ locale }) => {
                if (locale.isRegionIndependent && locale.toNeutralLanguageCode() === ENG_FALLBACK) {
                    pushLocaleToLinks(locale, DEFAULT_HREF_LANG);
                    isDefaultAddedToLinks = true;
                }
            }),
        );

        if (!isDefaultAddedToLinks) {
            // If there is no explicit region independent `en` translation for this story
            // we will try to find some link that already has `en` fallback
            const fallbackFromRegionIndependentLocales = hrefLangLinks.find(
                (alternate) => alternate.hrefLang === ENG_FALLBACK,
            );

            if (fallbackFromRegionIndependentLocales) {
                hrefLangLinks.push({
                    ...fallbackFromRegionIndependentLocales,
                    hrefLang: DEFAULT_HREF_LANG,
                });
                isDefaultAddedToLinks = true;
            }
        }

        if (!isDefaultAddedToLinks) {
            // If there is no english locale at all we will use is_default language (provided from server)
            languagesWithLocales.forEach((binds) =>
                binds.forEach(({ locale, language }) => {
                    if (language.is_default) {
                        pushLocaleToLinks(locale, DEFAULT_HREF_LANG);
                        isDefaultAddedToLinks = true;
                    }
                }),
            );
        }
    }

    populateDirectLinks();
    populateRegionIndependentLinks();
    populateDefault();

    return hrefLangLinks.sort((a, b) => a.hrefLang.localeCompare(b.hrefLang));
}
