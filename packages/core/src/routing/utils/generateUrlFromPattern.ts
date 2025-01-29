import type { Locale } from '@prezly/theme-kit-intl';
import { omitUndefined } from '@technically/omit-undefined';
import UrlPattern from 'url-pattern';

import { getShortestLocaleSlug } from './getShortestLocaleSlug';
import { normalizeUrl } from './normalizeUrl';

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

const CACHE = new Map<string, UrlPattern>();

function toUrlPattern(pattern: string): UrlPattern {
    const cached = CACHE.get(pattern);

    if (cached) return cached;

    const urlPattern = new UrlPattern(pattern);

    CACHE.set(pattern, urlPattern);

    return urlPattern;
}

export function generateUrlFromPattern(
    pattern: `/${string}`,
    params: Params = {},
    context?: Context,
) {
    const urlPattern = toUrlPattern(pattern);

    if (context) {
        const { localeCode } = params;
        const localeSlug = getLocaleSlug(params, context);

        return normalizeUrl(
            urlPattern.stringify(
                omitUndefined({
                    ...params,
                    localeCode,
                    localeSlug,
                }),
            ) as `/${string}`,
        );
    }

    return normalizeUrl(urlPattern.stringify(omitUndefined(params)) as `/${string}`);
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
