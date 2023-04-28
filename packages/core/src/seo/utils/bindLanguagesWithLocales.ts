import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { LangCode, LocaleCode } from '../../intl';
import { LocaleObject } from '../../intl';

interface LocaleWithLanguage<Language> {
    language: Language;
    locale: LocaleObject;
}

/**
 * Group languages by their region independent language code (e.g. "en" for "en-US" and "en-GB").
 */
export function bindLanguagesWithLocales<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
) {
    const localesByLangCode = new Map<LangCode, Map<LocaleCode, LocaleWithLanguage<Language>>>();

    languages.forEach((language) => {
        const languageLocale = LocaleObject.fromAnyCode(language.code);
        const regionIndependentLanguageCode = languageLocale.toNeutralLanguageCode();
        let currentLocale = localesByLangCode.get(regionIndependentLanguageCode);

        if (!currentLocale) {
            currentLocale = new Map();
            localesByLangCode.set(regionIndependentLanguageCode, currentLocale);
        }

        currentLocale.set(languageLocale.toHyphenCode(), { language, locale: languageLocale });
    });

    return localesByLangCode;
}
