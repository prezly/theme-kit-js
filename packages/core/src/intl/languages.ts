/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings, Story } from '@prezly/sdk';
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

export function getUnusedLanguages<
    Language extends Pick<NewsroomLanguageSettings, 'public_stories_count'>,
>(languages: Language[]): Language[] {
    return languages.filter((lang) => lang.public_stories_count === 0);
}

export function getLanguageByExactLocaleCode<
    Language extends Pick<NewsroomLanguageSettings, 'code'>,
>(languages: Language[], locale: Locale | Locale.AnyCode): Language | undefined {
    return languages.find((lang) => Locale.isEqual(lang.code, locale));
}

// See https://github.com/prezly/prezly/blob/master/lib/model/CulturePeer.php#L123
export function getLanguageByNeutralLocaleCode<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(languages: Language[], locale: Locale | Locale.AnyCode): Language | undefined {
    const usedLanguages = getUsedLanguages(languages);

    return (
        // Try to look in used cultures first (giving priority to used ones)
        usedLanguages.find((lang) => Locale.isSameLang(lang.code, locale)) ??
        // Search in all languages
        languages.find((lang) => Locale.isSameLang(lang.code, locale))
    );
}

// See https://github.com/prezly/prezly/blob/master/lib/model/CulturePeer.php#L159
export function getLanguageByShortRegionCode<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(languages: Language[], regionCode: Locale.RegionCode): Language | undefined {
    const usedLanguages = getUsedLanguages(languages);

    return (
        // Try to look in used cultures first (giving priority to used ones)
        usedLanguages.find((lang) => Locale.isRegionCode(lang.code, regionCode)) ??
        // Search in all languages
        languages.find((lang) => Locale.isRegionCode(lang.code, regionCode))
    );
}

export function getLanguageFromStory<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    story: Pick<Story, 'culture'>,
): Language | undefined {
    return languages.find((lang) => lang.code === story.culture.code);
}

/**
 * Extracts company information for the selected locale
 */
export function getCompanyInformation<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'company_information'>,
>(languages: Language[], locale: Locale | Locale.AnyCode): Language['company_information'] {
    const currentLanguage =
        getLanguageByExactLocaleCode(languages, locale) ?? getDefaultLanguage(languages);

    return currentLanguage.company_information;
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
