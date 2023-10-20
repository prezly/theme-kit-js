import { Locale } from '@prezly/theme-kit-intl';

const fallbacks: Record<Locale.LanguageCode, Locale.Code[]> = {
    en: ['en-US', 'en-GB'],
    fr: ['fr-FR', 'fr-CA'],
};

/**
 * Fallback locales for each region independent locale.
 * For example, a story has en-CA en-AU and en-GB locales. As you can see there is no region independent locale.
 * We will use a list of possible fallbacks to determine region independent locale alias.
 * In the provided example the result will be en-GB since it is defined in the localeFallback list
 * If the list will be en-CA en-AU and en-US then the result will be en-US since it is the first one and hence takes precedence.
 */
export function getFallbackLocale(
    langCode: Locale.LanguageCode,
    availableLocales: (Locale | Locale.Code)[],
): Locale | undefined {
    const code = fallbacks[langCode]?.find((fallback) =>
        Boolean(availableLocales.find((available) => Locale.isEqual(available, fallback))),
    );

    return code ? Locale.from(code) : undefined;
}
