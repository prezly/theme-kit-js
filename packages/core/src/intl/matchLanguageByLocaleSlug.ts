/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

import {
    getLanguageByExactLocaleCode,
    getUnusedLanguages,
    getUsedLanguages,
    isNumberCode,
} from './languages';

/**
 * Get matching language for the requested locale slug.
 * The logic is reversed from `getShortestLocaleSlug`, so that it "unwraps" the possible variants with no collisions
 *
 * The order of checks is:
 * - exact locale slug match
 * - match language code, preferring non-default languages
 * - match region code, preferring non-default languages
 * - match language code across all languages
 * - match region code across all languages
 */
export function matchLanguageByLocaleSlug<
    Language extends Pick<NewsroomLanguageSettings, 'is_default' | 'code' | 'public_stories_count'>,
>(languages: Language[], slug: Locale.AnySlug): Language | undefined {
    const defaultLanguage = languages.filter((lang) => lang.is_default);
    const usedLanguages = getUsedLanguages(languages);
    const otherLanguages = getUnusedLanguages(languages);

    return (
        // 1) Exact match
        getLanguageByExactLocaleCode(languages, slug) ??
        // 2) Match lang code
        matchLanguageByLangSlug(defaultLanguage, slug) ?? // prefer default language
        matchLanguageByLangSlug(usedLanguages, slug) ?? // then used languages
        matchLanguageByLangSlug(otherLanguages, slug) ?? // then any enabled language
        // 3) Match region code
        matchLanguageByRegionSlug(defaultLanguage, slug) ?? // prefer default language
        matchLanguageByRegionSlug(usedLanguages, slug) ?? // then used languages
        matchLanguageByRegionSlug(otherLanguages, slug) ?? // then any enabled language
        undefined
    );
}

function matchLanguageByLangSlug<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    langSlug: Locale.AnySlug,
) {
    const candidates = languages.filter((lang) => Locale.isLanguageCode(lang.code, langSlug));

    if (candidates.length === 1) {
        return candidates[0];
    }

    return undefined;
}

function matchLanguageByRegionSlug<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    regionSlug: Locale.AnySlug | undefined,
) {
    if (!regionSlug || isNumberCode(regionSlug)) {
        return undefined;
    }

    const candidates = languages.filter((lang) => Locale.isRegionCode(lang.code, regionSlug));

    if (candidates.length === 1) {
        return candidates[0];
    }

    return undefined;
}
