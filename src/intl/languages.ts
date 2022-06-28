import type { CultureRef, NewsroomLanguageSettings, Story } from '@prezly/sdk';

import { DUMMY_DEFAULT_LOCALE } from './locale';
import { LocaleObject } from './localeObject';

function isOnlyCulture(culture: CultureRef, languages: NewsroomLanguageSettings[]): boolean {
    const numberOfLanguages = languages.filter(
        ({ locale: { language_code } }) => language_code === culture.language_code,
    ).length;

    return numberOfLanguages === 1;
}

/**
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
    language: NewsroomLanguageSettings,
    languages: NewsroomLanguageSettings[],
): string {
    const { locale } = language;

    if (isOnlyCulture(locale, languages)) {
        const cultureNameIndex = locale.native_name.indexOf('(');

        if (cultureNameIndex !== -1) {
            return locale.native_name.slice(0, cultureNameIndex - 1);
        }
    }

    return locale.native_name;
}

/**
 * @returns Language set as default in the Newsroom Settings.
 */
export function getDefaultLanguage(languages: NewsroomLanguageSettings[]) {
    return languages.find(({ is_default }) => is_default) || languages[0];
}

/**
 * @returns Only languages having at least one published story
 */
export function getUsedLanguages(languages: NewsroomLanguageSettings[]) {
    return languages.filter((language) => language.public_stories_count > 0);
}

export function getLanguageByExactLocaleCode(
    languages: NewsroomLanguageSettings[],
    locale: LocaleObject,
) {
    const localeCode = locale.toUnderscoreCode();
    return languages.find(({ code }) => code === localeCode);
}

// See https://github.com/prezly/prezly/blob/master/lib/model/CulturePeer.php#L123
export function getLanguageByNeutralLocaleCode(
    languages: NewsroomLanguageSettings[],
    locale: LocaleObject,
) {
    const neutralLanguageCode = locale.toNeutralLanguageCode();

    // Prefer default language
    const defaultLanguage = getDefaultLanguage(languages);
    // TODO: This doesn't align with other methods logic
    if (defaultLanguage.code === locale.toUnderscoreCode()) {
        return defaultLanguage;
    }

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
export function getLanguageByShortRegionCode(
    languages: NewsroomLanguageSettings[],
    locale: LocaleObject,
) {
    const shortRegionCode = locale.toRegionCode();

    // Prefer default language
    const defaultLanguage = getDefaultLanguage(languages);
    if (LocaleObject.fromAnyCode(defaultLanguage.code).toRegionCode() === shortRegionCode) {
        return defaultLanguage;
    }

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

/**
 * Retrieve a culture with fallback to legacy codes support.
 * Pulled from https://github.com/prezly/prezly/blob/de9900d9890a33502780494aa3fb85c9a732b3c3/lib/model/CulturePeer.php#L91-L114
 */
export function getLanguageFromNextLocaleIsoCode(
    languages: NewsroomLanguageSettings[],
    nextLocaleIsoCode?: string,
): NewsroomLanguageSettings | undefined {
    const defaultLanguage = getDefaultLanguage(languages);

    if (!nextLocaleIsoCode || nextLocaleIsoCode === DUMMY_DEFAULT_LOCALE) {
        return defaultLanguage;
    }

    const locale = LocaleObject.fromAnyCode(nextLocaleIsoCode);
    let targetLanguage: NewsroomLanguageSettings | undefined;

    if (nextLocaleIsoCode.length >= 2 && nextLocaleIsoCode.length <= 4) {
        targetLanguage =
            getLanguageByExactLocaleCode(languages, locale) ||
            getLanguageByNeutralLocaleCode(languages, locale) ||
            getLanguageByShortRegionCode(languages, locale);
    } else {
        targetLanguage = getLanguageByExactLocaleCode(languages, locale);
    }

    return targetLanguage;
}

export function getLanguageFromStory(languages: NewsroomLanguageSettings[], story: Story) {
    const { code: storyLocaleCode } = story.culture;

    return languages.find(({ code }) => code === storyLocaleCode);
}

/**
 * Extracts company information for the selected locale
 */
export function getCompanyInformation(languages: NewsroomLanguageSettings[], locale: LocaleObject) {
    const currentLanguage =
        getLanguageByExactLocaleCode(languages, locale) || getDefaultLanguage(languages);

    return currentLanguage.company_information;
}

/**
 * Get shortest locale code possible from full locale code
 * First: try shorting to neutral language code (there should be no locales with the same language code)
 * Then: try shorting to region code (there should be no locales with the same region code)
 * Finally: return the original locale code (shorting is not possible)
 *
 * @param locale A LocaleObject constructed from FULL locale code (taken straight from the selected language)
 */
export function getShortestLocaleCode(
    languages: NewsroomLanguageSettings[],
    locale: LocaleObject,
): string | false {
    const localeCode = locale.toUnderscoreCode();
    const defaultLanguage = getDefaultLanguage(languages);
    // If it's a default locale, return false (no locale needed in URL)
    if (localeCode === defaultLanguage.code) {
        return false;
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
    const mathchingNeutralLanguagesByRegionCode = languages.filter(
        ({ code }) =>
            LocaleObject.fromAnyCode(code).toNeutralLanguageCode() === lowerCasedShortRegionCode ||
            code === lowerCasedShortRegionCode,
    );
    if (
        matchingLanguagesByRegionCode.length === 1 &&
        // If there are 2 or more matching neutral languages, it means that there are no languages that can be shortened to neutral code
        mathchingNeutralLanguagesByRegionCode.length !== 1
    ) {
        return shortRegionCode;
    }

    return localeCode;
}
