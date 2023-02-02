import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { AlternateLanguageLink } from '../components-nextjs/PageSeo';
import type { LangCode, LocaleCode } from '../intl';
import { getFallbackLocale, LocaleObject } from '../intl';

function mapLanguagesToLocales(languages: NewsroomLanguageSettings[]) {
    let defaultLocale: LocaleObject | undefined;
    const localesByLanguage = new Map<LangCode, Map<LocaleCode, LocaleObject>>();

    languages.forEach((language) => {
        const locale = LocaleObject.fromAnyCode(language.code);
        const globalLanguageCode = locale.toNeutralLanguageCode();
        let currentLocale = localesByLanguage.get(globalLanguageCode);

        if (!currentLocale) {
            currentLocale = new Map([[locale.toHyphenCode(), locale]]);
            localesByLanguage.set(globalLanguageCode, currentLocale);
        }

        currentLocale.set(locale.toHyphenCode(), locale);

        if (language.is_default) {
            defaultLocale = locale;
        }
    });

    return [localesByLanguage, defaultLocale] as const;
}

function createAlternateLanguageLink(
    locale: LocaleObject,
    getTranslationUrl: (locale: LocaleObject) => string | undefined,
    createHref: (locale: LocaleObject, translationUrl: string) => string,
) {
    const translationUrl = getTranslationUrl(locale);

    if (!translationUrl) {
        return undefined;
    }

    return {
        hrefLang: locale.toHyphenCode(),
        href: createHref(locale, translationUrl),
    };
}

function getXdefaultHrefLang(
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

export function getAlternateLanguageLinks(
    languages: NewsroomLanguageSettings[],
    getTranslationUrl: (locale: LocaleObject) => string | undefined,
    createHref: (locale: LocaleObject, translationUrl: string) => string,
): AlternateLanguageLink[] {
    const globalLocalesFallbackLinks: AlternateLanguageLink[] = [];
    const localeAlternates: LocaleObject[] = [];
    const [localesMap, defaultLocale] = mapLanguagesToLocales(languages);

    localesMap.forEach((locales, globalLocaleCode) => {
        let hasGlobalLocale = false;

        locales.forEach((locale) => {
            localeAlternates.push(locale);

            if (!hasGlobalLocale && locale.isGlobal) {
                hasGlobalLocale = true;
            }
        });

        if (!hasGlobalLocale) {
            const localesArray = Array.from(locales.values());
            const fallback =
                getFallbackLocale(globalLocaleCode, localesArray) ?? localesArray.at(0);

            if (fallback) {
                const fallbackLink = createAlternateLanguageLink(
                    fallback,
                    getTranslationUrl,
                    createHref,
                );

                if (fallbackLink) {
                    globalLocalesFallbackLinks.push({
                        ...fallbackLink,
                        hrefLang: globalLocaleCode,
                    });
                }
            }
        }
    });

    let languageAlternates: Array<AlternateLanguageLink | undefined> = localeAlternates.map(
        (locale) => createAlternateLanguageLink(locale, getTranslationUrl, createHref),
    );

    languageAlternates = languageAlternates.concat(globalLocalesFallbackLinks);

    const xDefault = getXdefaultHrefLang(
        localeAlternates,
        globalLocalesFallbackLinks,
        defaultLocale,
        getTranslationUrl,
        createHref,
    );

    languageAlternates.push(xDefault);

    return languageAlternates
        .filter((link): link is Exclude<typeof link, undefined> => Boolean(link))
        .sort((a, b) => a.hrefLang.localeCompare(b.hrefLang));
}
