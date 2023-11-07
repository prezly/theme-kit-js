import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

interface LocaleWithLanguage<Language> {
    language: Language;
    locale: Locale;
}

/**
 * Group languages by their region independent language code (e.g. "en" for "en-US" and "en-GB").
 */
export function bindLanguagesWithLocales<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
) {
    const localesByLangCode = new Map<
        Locale.LangCode,
        Map<Locale.IsoCode, LocaleWithLanguage<Language>>
    >();

    languages.forEach((language) => {
        const locale = Locale.from(language.code);
        let currentLocale = localesByLangCode.get(locale.lang);

        if (!currentLocale) {
            currentLocale = new Map();
            localesByLangCode.set(locale.lang, currentLocale);
        }

        currentLocale.set(locale.isoCode, { language, locale });
    });

    return localesByLangCode;
}
