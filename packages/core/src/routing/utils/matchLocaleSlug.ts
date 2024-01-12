/* eslint-disable @typescript-eslint/no-use-before-define */
import { Locale } from '@prezly/theme-kit-intl';

import { isNumberCode } from './isNumberCode';

/**
 * Match the requested locale slug against the enabled locales.
 * The enabled locales have to be provided in the order of importance:
 * default first, then locales with public stories, then the rest.
 *
 * The logic is reversed from `getShortestLocaleSlug`, so that it "unwraps" the possible variants.
 * @see {getShortestLocaleSlug()}
 *
 * The order of checks is:
 * - exact locale slug match
 * - match by language code
 * - match by region code
 */
export function matchLocaleSlug(
    slug: Locale.AnySlug,
    locales: Locale.Code[],
): Locale.Code | undefined {
    return (
        matchByExactLocaleSlug(slug, locales) ??
        matchByLangSlug(slug, locales) ??
        matchByRegionSlug(slug, locales) ??
        undefined
    );
}

function matchByExactLocaleSlug(
    slug: Locale.AnySlug,
    locales: Locale.Code[],
): Locale.Code | undefined {
    if (!Locale.isValid(slug)) return undefined;
    const locale = Locale.from(slug);
    return locales.find((localeCode) => localeCode === locale.code);
}

function matchByLangSlug(slug: Locale.AnySlug, locales: Locale.Code[]) {
    return locales.find((localeCode) =>
        Locale.isLanguageCode(localeCode, slug.toLowerCase() as Locale.LangCode),
    );
}

function matchByRegionSlug(slug: Locale.AnySlug | undefined, locales: Locale.Code[]) {
    if (!slug || isNumberCode(slug)) {
        return undefined;
    }

    return locales.find((localeCode) =>
        Locale.isRegionCode(localeCode, slug.toUpperCase() as Locale.RegionCode),
    );
}
