import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { LangCode, LocaleCode } from '../../intl';
import { LocaleObject } from '../../intl';

/**
 * Group languages by their global language code (e.g. "en" for "en-US" and "en-GB").
 */
export function mapLanguagesToLocales(languages: NewsroomLanguageSettings[]) {
    let defaultLangLocale: LocaleObject | undefined;
    const localesByLangCode = new Map<LangCode, Map<LocaleCode, LocaleObject>>();

    languages.forEach((language) => {
        const languageLocale = LocaleObject.fromAnyCode(language.code);
        const globalLanguageCode = languageLocale.toNeutralLanguageCode();
        let currentLocale = localesByLangCode.get(globalLanguageCode);

        if (!currentLocale) {
            currentLocale = new Map();
            localesByLangCode.set(globalLanguageCode, currentLocale);
        }

        currentLocale.set(languageLocale.toHyphenCode(), languageLocale);

        if (language.is_default) {
            defaultLangLocale = languageLocale;
        }
    });

    return [localesByLangCode, defaultLangLocale] as const;
}
