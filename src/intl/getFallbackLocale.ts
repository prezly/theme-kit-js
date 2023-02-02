import type { LangCode } from './locale';
import { LocaleObject } from './localeObject';

/**
 * Fallback locales for each language.
 * For example, a story has no en(global) locale, then we can take some fallback locale from here.
 */
export const localeFallback: Record<LangCode, LocaleObject[]> = {
    en: [LocaleObject.fromAnyCode('en-US'), LocaleObject.fromAnyCode('en-GB')],
    fr: [LocaleObject.fromAnyCode('fr-FR'), LocaleObject.fromAnyCode('fr-CA')],
};

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
