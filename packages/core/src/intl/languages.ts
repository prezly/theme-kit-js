/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings, Story } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

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
    language: Pick<NewsroomLanguageSettings, 'locale'>,
    languages: Pick<NewsroomLanguageSettings, 'locale'>[],
): string {
    const localeCode = language.locale.code;

    const candidates = languages.filter((lang) => Locale.isSameLang(lang.locale.code, localeCode));

    if (candidates.length === 1) {
        return language.locale.native_name.replace(/\s*\(.*/, '');
    }

    return language.locale.native_name;
}

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

/**
 * Get the shortest locale code possible from full locale code
 * First: try shorting to neutral language code (there should be no locales with the same language code)
 * Then: try shorting to region code (there should be no locales with the same region code)
 * Finally: return the original locale code (shorting is not possible)
 */
export function getShortestLocaleSlug<
    Language extends Pick<NewsroomLanguageSettings, 'code' | 'is_default'>,
>(languages: Language[], locale: Locale | Locale.AnyCode): string | false {
    const {
        code: localeCode,
        lang: langCode,
        region: regionCode,
        slug: localeSlug,
    } = Locale.from(locale);

    console.log({ localeCode, langCode, regionCode });

    const defaultLanguage = getDefaultLanguage(languages);
    // If it's a default locale, return false (no locale needed in URL)
    if (localeCode === defaultLanguage.code) {
        return false;
    }

    return (
        // Try shortening to neutral language code
        (
            getUnambiguousLangCode(languages, langCode) ??
            // Try shortening to region code
            getUnambiguousRegionCode(languages, regionCode) ??
            // Return the original (exact) code if shortening is not possible
            localeSlug
        ).toLowerCase()
    );
}

function getUnambiguousLangCode<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    langCode: Locale.LanguageCode,
) {
    const candidates = languages.filter(
        (lang) => Locale.toNeutralLanguageCode(lang.code) === langCode,
    );

    if (candidates.length === 1) {
        return langCode;
    }

    return undefined;
}

function getUnambiguousRegionCode<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    regionCode: Locale.RegionCode | undefined,
) {
    if (!regionCode) {
        return undefined;
    }

    if (!Number.isNaN(Number(regionCode))) {
        // We don't want just numbers in our region code
        return undefined;
    }

    const candidates = languages.filter((lang) => Locale.isRegionCode(lang.code, regionCode));
    // Prevent collision with neutral language codes
    const collisions = languages.filter(
        (lang) => Locale.toNeutralLanguageCode(lang.code) === regionCode.toLowerCase(),
    );

    if (candidates.length === 1 && collisions.length === 0) {
        return regionCode;
    }

    return undefined;
}

/**
 * Get matching language for the requested locale
 * The logic is reversed from `getShortestLocaleCode`, so that it "unwraps" the possible variants with no collisions
 *
 * First:   get by exact match
 * Then:    get by matching region code part
 * Finally: get by matching language code part
 */
export function getLanguageFromLocaleIsoCode<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(languages: Language[], locale: Locale | Locale.AnyCode): Language | undefined {
    const { code: localeCode, lang: langCode, region: regionCode } = Locale.from(locale);

    return (
        getLanguageByExactLocaleCode(languages, localeCode) ??
        getUnambiguousLanguageByLangCode(languages, langCode) ??
        getUnambiguousLanguageByRegionCode(languages, regionCode) ??
        undefined
    );
}

function getUnambiguousLanguageByLangCode<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    langCode: Locale.LanguageCode,
) {
    const candidates = languages.filter(
        (lang) => Locale.toNeutralLanguageCode(lang.code) === langCode,
    );

    if (candidates.length === 1) {
        return candidates[0];
    }

    return undefined;
}

function getUnambiguousLanguageByRegionCode<
    Language extends Pick<NewsroomLanguageSettings, 'code'>,
>(languages: Language[], regionCode: Locale.RegionCode | undefined) {
    if (!regionCode) {
        return undefined;
    }

    const candidates = languages.filter((lang) => Locale.isRegionCode(lang.code, regionCode));

    if (candidates.length === 1) {
        return candidates[0];
    }

    return undefined;
}
