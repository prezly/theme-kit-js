import type { LangCode } from './locale';
import { LocaleObject } from './localeObject';

const localeFallback: Record<LangCode, LocaleObject[]> = {
    en: [LocaleObject.fromAnyCode('en-US'), LocaleObject.fromAnyCode('en-GB')],
    fr: [LocaleObject.fromAnyCode('fr-FR'), LocaleObject.fromAnyCode('fr-CA')],
};

/**
 * Fallback locales for each region independent locale.
 * For example, a story has en-CA en-AU and en-GB locales. As you can see there is no region independent locale.
 * We will use a list of possible fallbacks to determine region independent locale alias.
 * In the provided example the result will be en-GB since it is defined in the localeFallback list
 * If the list will be en-CA en-AU and en-US then the result will be en-US since it is the first one and hence takes precedence.
 */
export function getFallbackLocale(
    langCode: LangCode,
    availableLocales: LocaleObject[],
): LocaleObject | undefined {
    const fallbacks = localeFallback[langCode];

    if (!fallbacks) {
        return undefined;
    }

    return fallbacks.find((fallback) =>
        Boolean(availableLocales.find((available) => available.isEqual(fallback))),
    );
}
