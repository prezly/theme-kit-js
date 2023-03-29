import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { LangCode, LocaleCode } from '../../intl';
import { LocaleObject } from '../../intl';

interface LocaleWithLanguage {
    language: NewsroomLanguageSettings;
    locale: LocaleObject;
}

/**
 * Group languages by their region independent language code (e.g. "en" for "en-US" and "en-GB").
 */
export function bindLanguagesWithLocales(languages: NewsroomLanguageSettings[]) {
    const localesByLangCode = new Map<LangCode, Map<LocaleCode, LocaleWithLanguage>>();

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
