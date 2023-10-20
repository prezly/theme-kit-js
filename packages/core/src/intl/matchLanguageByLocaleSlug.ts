/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

import { getLanguageByExactLocaleCode, isNumberCode } from './languages';

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
    const prioritizedLanguages = [...languages].sort(
        (a, b) =>
            -cmp(a.is_default, b.is_default) || // prefer default language
            -cmp(a.public_stories_count, b.public_stories_count) || // then used languages
            -cmp(a.code, b.code), // then alphabetically by language code (for deterministic results)
    );

    return (
        getLanguageByExactLocaleCode(languages, slug) ??
        matchLanguageByLangSlug(prioritizedLanguages, slug) ??
        matchLanguageByRegionSlug(prioritizedLanguages, slug) ??
        undefined
    );
}

function matchLanguageByLangSlug<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    langSlug: Locale.AnySlug,
) {
    return languages.find((lang) => Locale.isLanguageCode(lang.code, langSlug));
}

function matchLanguageByRegionSlug<Language extends Pick<NewsroomLanguageSettings, 'code'>>(
    languages: Language[],
    regionSlug: Locale.AnySlug | undefined,
) {
    if (!regionSlug || isNumberCode(regionSlug)) {
        return undefined;
    }

    return languages.find((lang) => Locale.isRegionCode(lang.code, regionSlug));
}

function cmp(a: boolean, b: boolean): number;
function cmp(a: number, b: number): number;
function cmp(a: string, b: string): number;
function cmp<T extends boolean | number | string>(a: T, b: T) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}
