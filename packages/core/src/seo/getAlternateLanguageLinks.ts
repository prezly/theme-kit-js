/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';
import { isNotUndefined } from '@technically/is-not-undefined';

import type { AlternateLanguageLink } from './types';

// We use english locale as fallback since English is the most common language
const EN = 'en';
const X_DEFAULT = 'x-default';

const ALLOWED_FALLBACKS: Record<Locale.Code, Locale.LangCode> = {
    [`en_US`]: 'en',
    [`en_GB`]: 'en',
    [`fr_FR`]: 'fr',
    [`fr_CA`]: 'fr',
};

type HrefKey = Locale.Code | typeof X_DEFAULT;
type Url = string;

export function getAlternateLanguageLinks<
    Language extends Pick<NewsroomLanguageSettings, 'code' | 'is_default'>,
>(
    availableLanguages: Language[],
    generateTranslationUrl: (locale: Locale.Code) => string | undefined,
): AlternateLanguageLink[] {
    const defaultLanguage = availableLanguages.find((lang) => lang.is_default);

    // Generate the translation URLs map for the exact locale codes
    const translations = Object.fromEntries(
        availableLanguages.map((lang) => [lang.code, generateTranslationUrl(lang.code)]),
    ) as Record<HrefKey, Url | undefined>;

    // Initialize the links map with the existing translations
    const links = {
        ...translations,
    };

    // Add selected languages as possible region-independent translations, if not present yet.
    Object.entries(ALLOWED_FALLBACKS).forEach(([preferredFallbackLocale, langCode]) => {
        links[langCode] = links[langCode] ?? links[preferredFallbackLocale as Locale.Code];
    });

    // Add any same-language version as region-independent fallback, if not present yet.
    availableLanguages.forEach((lang) => {
        const { code: localeCode, lang: langCode } = Locale.from(lang.code);
        links[langCode] = links[langCode] ?? links[localeCode];
    });

    // Determine `x-default` version
    links[X_DEFAULT] =
        // First we try to find region independent English locale (en)
        // If the story has just region independent `en` translation we will use it as default hreflang
        links[EN] ??
        // If there are no English translations at all we will use the default language (provided by the server)
        (defaultLanguage ? links[defaultLanguage.code] : undefined);

    return Object.entries(links)
        .map(([hrefLang, href]): AlternateLanguageLink | undefined => {
            if (!href) {
                // some of the fallbacks logic above can result in undefined Urls present in the map
                return undefined;
            }
            if (hrefLang === X_DEFAULT) {
                // `x-default` is not a valid locale code, so we can't pass it to the `Locale.from()` call.
                return {
                    hrefLang: X_DEFAULT,
                    href,
                    type: 'x-default',
                };
            }
            return {
                hrefLang: Locale.from(hrefLang).isoCode,
                href,
                type: translations[hrefLang as HrefKey] ? 'exact' : 'alias',
            };
        })
        .filter(isNotUndefined)
        .sort((a, b) => a.hrefLang.localeCompare(b.hrefLang));
}
