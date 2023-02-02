import type { NewsroomLanguageSettings } from '@prezly/sdk';

import type { LangCode, LocaleCode } from '../../intl';
import { LocaleObject } from '../../intl';

export function mapLanguagesToLocales(languages: NewsroomLanguageSettings[]) {
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
