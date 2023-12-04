import type { CultureRef, NewsroomLanguageSettings, Story } from '@prezly/sdk';

import { LocaleObject } from './localeObject';

function isOnlyCulture(
    culture: Pick<CultureRef, 'language_code'>,
    languages: Pick<NewsroomLanguageSettings, 'locale'>[],
): boolean {
    const numberOfLanguages = languages.filter(
        ({ locale: { language_code } }) => language_code === culture.language_code,
    ).length;

    return numberOfLanguages === 1;
}

/**
 * @param mode - defaults to 'native', determines whether to return the native language name or the english language name
 *
 * @returns the display name of the locale in its native language
 *
 * If there's only one culture used in a specific language,
 * we strip the culture name completely.
 *
 * Examples:
 *  - English (Global), Spanish (Spain)
 *  - -> English, Spanish
 *  - English (Global), English (UK), Spanish (Spain)
 *  - -> English (Global), English (UK), Spanish
 */
export function getLanguageDisplayName(
    language: Pick<NewsroomLanguageSettings, 'locale'>,
    languages: Pick<NewsroomLanguageSettings, 'locale'>[],
    mode: 'native' | 'english' = 'native',
): string {
    const { locale } = language;
    const displayedName = mode === 'native' ? locale.native_name : locale.name;

    if (isOnlyCulture(locale, languages)) {
        const cultureNameIndex = displayedName.indexOf('(');

        if (cultureNameIndex !== -1) {
            return displayedName.slice(0, cultureNameIndex - 1);
        }
    }

    return displayedName;
}

/**
 * @returns Language set as default in the Newsroom Settings.
 */
export function getDefaultLanguage<Language extends Pick<NewsroomLanguageSettings, 'is_default'>>(
    languages: Language[],
): Language {
    return languages.find(({ is_default }) => is_default) || languages[0];
}

/**
 * @returns Only languages having at least one published story
 */
export function getUsedLanguages<
    Language extends Pick<NewsroomLanguageSettings, 'public_stories_count'>,
>(languages: Language[]): Language[] {
    return languages.filter((language) => language.public_stories_count > 0);
}

export function getLanguageByExactLocaleCode<
    Language extends Pick<NewsroomLanguageSettings, 'code'>,
>(languages: Language[], locale: LocaleObject): Language | undefined {
    const localeCode = locale.toUnderscoreCode();
    return languages.find(({ code }) => code === localeCode);
}

// See https://github.com/prezly/prezly/blob/master/lib/model/CulturePeer.php#L123
export function getLanguageByNeutralLocaleCode<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(languages: Language[], locale: LocaleObject): Language | undefined {
    const neutralLanguageCode = locale.toNeutralLanguageCode();

    // Try to look in used cultures first (giving priority to used ones)
    const usedLanguages = getUsedLanguages(languages);
    const usedLanguage = usedLanguages.find(
        ({ code }) =>
            LocaleObject.fromAnyCode(code).toNeutralLanguageCode() === neutralLanguageCode,
    );
    if (usedLanguage) {
        return usedLanguage;
    }

    // Search in all languages
    return languages.find(
        ({ code }) =>
            LocaleObject.fromAnyCode(code).toNeutralLanguageCode() === neutralLanguageCode,
    );
}

// See https://github.com/prezly/prezly/blob/master/lib/model/CulturePeer.php#L159
export function getLanguageByShortRegionCode<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(languages: Language[], locale: LocaleObject): Language | undefined {
    const shortRegionCode = locale.toRegionCode();

    // Try to look in used cultures first (giving priority to used ones)
    const usedLanguages = getUsedLanguages(languages);
    const usedLanguage = usedLanguages.find(
        ({ code }) => LocaleObject.fromAnyCode(code).toRegionCode() === shortRegionCode,
    );
    if (usedLanguage) {
        return usedLanguage;
    }

    // Search in all languages
    return languages.find(
        ({ code }) => LocaleObject.fromAnyCode(code).toRegionCode() === shortRegionCode,
    );
}

export function getLanguageFromStory<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    story: Pick<Story, 'culture'>,
): Language | undefined {
    const { code: storyLocaleCode } = story.culture;

    return languages.find(({ code }) => code === storyLocaleCode);
}

/**
 * Extracts company information for the selected locale
 */
export function getCompanyInformation<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'company_information'>,
>(languages: Language[], locale: LocaleObject): Language['company_information'] {
    const currentLanguage =
        getLanguageByExactLocaleCode(languages, locale) || getDefaultLanguage(languages);

    return currentLanguage.company_information;
}

/**
 * Get newsroom notifications for the selected locale
 */
export function getNotifications<
    Language extends Pick<NewsroomLanguageSettings, 'code' | 'is_default' | 'notifications'>,
>(languages: Language[], locale: LocaleObject): Language['notifications'] {
    const currentLanguage =
        getLanguageByExactLocaleCode(languages, locale) || getDefaultLanguage(languages);

    return currentLanguage.notifications;
}

/**
 * Get the shortest locale code possible from full locale code
 * First: try shorting to neutral language code (there should be no locales with the same language code)
 * Then: try shorting to region code (there should be no locales with the same region code)
 * Finally: return the original locale code (shorting is not possible)
 *
 * @param locale A LocaleObject constructed from FULL locale code (taken straight from the selected language)
 */
export function getShortestLocaleCode<
    Language extends Pick<NewsroomLanguageSettings, 'code' | 'is_default'>,
>(languages: Language[], locale: LocaleObject): string | false {
    const localeCode = locale.toUnderscoreCode();
    const defaultLanguage = getDefaultLanguage(languages);
    // If it's a default locale, return false (no locale needed in URL)
    if (localeCode === defaultLanguage.code) {
        return false;
    }

    // Undocumented feature: you can completely disable locale shortening by setting `NEXT_PUBLIC_BYPASS_LOCALE_CODE_SHORTENING` env variable.
    // Currently used by a custom theme.
    if (process.env.NEXT_PUBLIC_BYPASS_LOCALE_CODE_SHORTENING) {
        return localeCode;
    }

    // Try shorting to neutral language code
    const neutralLanguageCode = locale.toNeutralLanguageCode();
    const matchingLanguagesByNeutralCode = languages.filter(
        ({ code }) =>
            LocaleObject.fromAnyCode(code).toNeutralLanguageCode() === neutralLanguageCode ||
            code === neutralLanguageCode,
    );
    if (matchingLanguagesByNeutralCode.length === 1) {
        return neutralLanguageCode;
    }

    // Try shorting to region code
    const shortRegionCode = locale.toRegionCode();
    const matchingLanguagesByRegionCode = languages.filter(
        ({ code }) => LocaleObject.fromAnyCode(code).toRegionCode() === shortRegionCode,
    );
    // Prevent collision with neutral language codes
    const lowerCasedShortRegionCode = shortRegionCode.toLowerCase();
    const matchingNeutralLanguagesByRegionCode = languages.filter(
        ({ code }) =>
            LocaleObject.fromAnyCode(code).toNeutralLanguageCode() === lowerCasedShortRegionCode ||
            code === lowerCasedShortRegionCode,
    );
    if (
        matchingLanguagesByRegionCode.length === 1 &&
        // If there are 2 or more matching neutral languages, it means that there are no languages that can be shortened to neutral code
        matchingNeutralLanguagesByRegionCode.length !== 1 &&
        // We don't want just numbers in our region code
        Number.isNaN(Number(shortRegionCode))
    ) {
        return shortRegionCode;
    }

    // Return the original (exact) code if shortening is not possible
    return localeCode;
}

/**
 * Get matching language for the requested locale
 * The logic is reversed from `getShortestLocaleCode`, so that it "unwraps" the possible variants with no collisions
 *
 * First: get by exact match
 * Then: get by matching region code part
 * Finally: get by matching language code part
 *
 * @param locale A LocaleObject constructed from the requested locale code (taken straight from the URL)
 */
export function getLanguageFromLocaleIsoCode<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(languages: Language[], locale: LocaleObject): Language | undefined {
    // Prefer exact match
    const exactMatchedLanguage = getLanguageByExactLocaleCode(languages, locale);
    if (exactMatchedLanguage) {
        return exactMatchedLanguage;
    }

    // If locale code is not region independent, it means that it's not a shortened code (consists of two parts).
    // If it didn't match by exact code, there's no reason to check for region/language code match
    if (!locale.isRegionIndependent) {
        return undefined;
    }

    // We're excluding the default language, since it shouldn't have a URL slug
    const languagesWithoutDefault = languages.filter(({ is_default }) => !is_default);

    const shortRegionCode = locale.toRegionCode();
    const neutralLanguageCode = locale.toNeutralLanguageCode();

    const languageWithSameRegionAndNeutralCode = languagesWithoutDefault.find(({ code }) => {
        const comparingLocale = LocaleObject.fromAnyCode(code);
        const hasSameNeutralCode = comparingLocale.toNeutralLanguageCode() === neutralLanguageCode;
        const hasSameRegionCode = comparingLocale.toRegionCode() === shortRegionCode;
        return hasSameNeutralCode && hasSameRegionCode;
    });

    if (languageWithSameRegionAndNeutralCode) {
        return languageWithSameRegionAndNeutralCode;
    }

    const regionMatchedLanguage = getLanguageByShortRegionCode(languagesWithoutDefault, locale);
    if (regionMatchedLanguage) {
        return regionMatchedLanguage;
    }

    const neutralMatchedLanguage = getLanguageByNeutralLocaleCode(languagesWithoutDefault, locale);
    if (neutralMatchedLanguage) {
        return neutralMatchedLanguage;
    }

    return undefined;
}
