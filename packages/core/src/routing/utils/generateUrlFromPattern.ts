import type { Locale } from '@prezly/theme-kit-intl';
import { omitUndefined } from '@technically/omit-undefined';
import UrlPattern from 'url-pattern';

import { URL_PATTERN_SEGMENT_CHARSET } from '../constants';

import { getShortestLocaleSlug } from './getShortestLocaleSlug';
import { normalizeUrl } from './normalizeUrl';
import { parseWildcard, stringify, type Wildcard } from './wildcard';

export interface Context {
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
    toLocaleSlug?: (
        locale: Locale.Code,
        context: Pick<Context, 'defaultLocale' | 'locales'>,
    ) => Locale.UrlSlug;
}

export type Params = Record<string, string | undefined | null> &
    ({ localeCode?: Locale.Code } | { localeSlug?: Locale.AnySlug });

interface Parsed {
    urlPattern: UrlPattern;
    wildcard: Wildcard['name'];
}

const CACHE = new Map<string, Parsed>();

function toUrlPattern(pattern: string): Parsed {
    const cached = CACHE.get(pattern);

    if (cached) return cached;

    // A pattern can end in a named wildcard (`/category/*path`), which takes several segments.
    const wildcard = parseWildcard(pattern);
    const parsed = {
        urlPattern: new UrlPattern(wildcard.pattern, {
            segmentValueCharset: URL_PATTERN_SEGMENT_CHARSET,
        }),
        wildcard: wildcard.name,
    };

    CACHE.set(pattern, parsed);

    return parsed;
}

export function generateUrlFromPattern(
    pattern: `/${string}`,
    params: Params = {},
    context?: Context,
) {
    const { urlPattern, wildcard } = toUrlPattern(pattern);

    if (context) {
        const { localeCode } = params;
        const localeSlug = getLocaleSlug(params, context);

        return normalizeUrl(
            stringify(
                urlPattern,
                omitUndefined({
                    ...params,
                    localeCode,
                    localeSlug,
                }),
                wildcard,
            ) as `/${string}`,
        );
    }

    return normalizeUrl(stringify(urlPattern, omitUndefined(params), wildcard) as `/${string}`);
}

function getLocaleSlug(params: Params, context: Context): string {
    if (params.localeSlug) {
        return params.localeSlug;
    }
    if (params.localeCode) {
        const { toLocaleSlug = getShortestLocaleSlug } = context;
        return toLocaleSlug(params.localeCode as Locale.Code, context) || '';
    }
    return '';
}
