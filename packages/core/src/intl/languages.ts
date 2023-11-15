/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

/**
 * @returns Language set as default in the Newsroom Settings.
 */
export function getDefaultLanguage<Language extends Pick<NewsroomLanguageSettings, 'is_default'>>(
    languages: Language[],
): Language {
    return languages.find((lang) => lang.is_default) ?? languages[0];
}

/**
 * @returns Only languages having at least one published story
 */
export function getUsedLanguages<
    Language extends Pick<NewsroomLanguageSettings, 'public_stories_count'>,
>(languages: Language[]): Language[] {
    return languages.filter((lang) => lang.public_stories_count > 0);
}

export function getLanguageByExactLocaleCode<
    Language extends Pick<NewsroomLanguageSettings, 'code'>,
>(languages: Language[], locale: Locale | Locale.AnyCode): Language | undefined {
    if (typeof locale === 'string' && !Locale.isValid(locale)) {
        return undefined;
    }
    return languages.find((lang) => Locale.isEqual(lang.code, locale));
}

/**
 * Get newsroom notifications for the selected locale
 */
export function getNotifications<
    Language extends Pick<NewsroomLanguageSettings, 'code' | 'is_default' | 'notifications'>,
>(languages: Language[], locale: Locale | Locale.AnyCode): Language['notifications'] {
    const currentLanguage =
        getLanguageByExactLocaleCode(languages, locale) ?? getDefaultLanguage(languages);

    return currentLanguage.notifications;
}

export function isNumberCode(code: string) {
    return !Number.isNaN(Number(code));
}
