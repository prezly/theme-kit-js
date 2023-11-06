/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';
import { isNotUndefined } from '@technically/is-not-undefined';

import type { AlternateLanguageLink } from './types';

// We use english locale as fallback since English is the most common language
const EN = 'en';
const X_DEFAULT = 'x-default';

const ALLOWED_FALLBACKS: Record<Locale.LanguageCode, Locale.Code[]> = {
    en: ['en_US', 'en_GB'],
    fr: ['fr_FR', 'fr_CA'],
};

type HrefKey = Locale.Code | typeof X_DEFAULT;
type Url = string;

export function getAlternateLanguageLinks<
    Language extends Pick<NewsroomLanguageSettings, 'code' | 'is_default'>,
>(
    availableLanguages: Language[],
    generateTranslationUrl: (locale: Locale) => string | undefined,
): AlternateLanguageLink[] {
    const defaultLanguage = availableLanguages.find((lang) => lang.is_default);

    // Generate the map translation URLs for the exact locale codes
    const links: Record<HrefKey, Url | undefined> = Object.fromEntries(
        availableLanguages.map((lang) => [
            lang.code,
            generateTranslationUrl(Locale.from(lang.code)),
        ]),
    );

    // Add selected languages as possible region-independent translations, if not present yet.
    Object.entries(ALLOWED_FALLBACKS).forEach(([langCode, fallbacks]) => {
        fallbacks.forEach((preferredFallbackLocale) => {
            links[langCode] = links[langCode] ?? links[preferredFallbackLocale];
        });
    });

    // Add any same-language version as region-independent fallback, if not present yet.
    availableLanguages.forEach((lang) => {
        const locale = Locale.from(lang.code);
        links[locale.lang] = links[locale.lang] ?? links[locale.code];
    });

    // Determine `x-default` version
    links[X_DEFAULT] =
        // First we try to find region independent English locale (en)
        // If the story has just region independent `en` translation we will use it as default hreflang
        links[EN] ??
        // If there are no English translations at all we will use the default language (provided by the server)
        (defaultLanguage ? links[defaultLanguage.code] : undefined);

    return Object.entries(links)
        .map(([hrefLang, href]) => {
            if (!href) {
                // some of the fallbacks logic above can result in undefined Urls present in the map
                return undefined;
            }
            if (hrefLang === X_DEFAULT) {
                // `x-default` is not a valid locale code, so we can't pass it to the `Locale.from()` call.
                return { hrefLang: X_DEFAULT, href };
            }
            return { hrefLang: Locale.from(hrefLang).isoCode, href };
        })
        .filter(isNotUndefined)
        .sort((a, b) => a.hrefLang.localeCompare(b.hrefLang));
}
