import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { AlternateLanguageLink } from '../components-nextjs/PageSeo';
import type { LangCode, LocaleCode } from '../intl';
import { getFallbackLocale, LocaleObject } from '../intl';

export function mapLanguagesToLocales(languages: NewsroomLanguageSettings[]) {
    const localesByLanguage = new Map<LangCode, Map<LocaleCode, LocaleObject>>();

    languages.forEach((language) => {
        const locale = LocaleObject.fromAnyCode(language.code);
        const languageCode = locale.toNeutralLanguageCode();
        let currentLocale = localesByLanguage.get(languageCode);

        if (!currentLocale) {
            currentLocale = new Map([[locale.toHyphenCode(), locale]]);
            localesByLanguage.set(languageCode, currentLocale);
        }

        currentLocale.set(locale.toHyphenCode(), locale);
    });

    return localesByLanguage;
}

function createAlternateLanguageLink(
    locale: LocaleObject,
    translationUrl: string,
    createHref: (locale: LocaleObject, translationUrl: string) => string,
) {
    return {
        hrefLang: locale.toHyphenCode(),
        href: createHref(locale, translationUrl),
    };
}

export function getAlternateLanguageLinks(
    languages: NewsroomLanguageSettings[],
    getTranslationUrl: (locale: LocaleObject) => string | undefined,
    createHref: (locale: LocaleObject, translationUrl: string) => string,
) {
    const languageAlternates: AlternateLanguageLink[] = [];
    const localesMap = mapLanguagesToLocales(languages);

    localesMap.forEach((locales, localeCode) => {
        let hasGlobalLocale = false;

        locales.forEach((locale) => {
            const translationUrl = getTranslationUrl(locale);

            if (!translationUrl) {
                return;
            }

            const alternateLanguageLink = createAlternateLanguageLink(
                locale,
                translationUrl,
                createHref,
            );

            languageAlternates.push(alternateLanguageLink);

            if (!hasGlobalLocale && locale.isGlobal) {
                hasGlobalLocale = true;
            }
        });

        if (!hasGlobalLocale) {
            const localesArray = Array.from(locales.values());
            const availableLocales = localesArray;
            const fallback = getFallbackLocale(localeCode, availableLocales) ?? localesArray.at(0);

            if (fallback) {
                const translationUrl = getTranslationUrl(fallback);

                if (!translationUrl) {
                    return;
                }

                const alternateLanguageLink = createAlternateLanguageLink(
                    LocaleObject.fromAnyCode(localeCode),
                    translationUrl,
                    createHref,
                );

                languageAlternates.push(alternateLanguageLink);
            }
        }
    });

    const defaultHrefLang =
        languageAlternates.find((alternate) => alternate.hrefLang === 'en') ??
        languages.find(
            (language) =>
                language.is_default && getTranslationUrl(LocaleObject.fromAnyCode(language.code)),
        );

    if (defaultHrefLang) {
        if ('hrefLang' in defaultHrefLang) {
            languageAlternates.push({ ...defaultHrefLang, hrefLang: 'x-default' });
        } else {
            languageAlternates.push({
                ...createAlternateLanguageLink(
                    LocaleObject.fromAnyCode(defaultHrefLang.code),
                    getTranslationUrl(LocaleObject.fromAnyCode(defaultHrefLang.code))!,
                    createHref,
                ),
                hrefLang: 'x-default',
            });
        }
    }

    return languageAlternates;
}
