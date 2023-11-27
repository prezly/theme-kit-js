/* eslint-disable @typescript-eslint/no-use-before-define */
import { Routing } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import UrlPattern from 'url-pattern';

import { withoutUndefined } from '../../../utils';

import { normalizeUrl } from './normalizeUrl';

export interface Context {
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
}

export type Params = Record<string, string | undefined | null> &
    ({ localeCode: Locale.Code } | { localeSlug: Locale.AnySlug });

const CACHE = new Map<string, UrlPattern>();

function toUrlPattern(pattern: string): UrlPattern {
    const cached = CACHE.get(pattern);

    if (cached) return cached;

    const urlPattern = new UrlPattern(pattern);

    CACHE.set(pattern, urlPattern);

    return urlPattern;
}

export function generateUrlFromPattern(pattern: `/${string}`, params: Params, context?: Context) {
    const urlPattern = toUrlPattern(pattern);

    if (context) {
        const { locales, defaultLocale } = context;

        const { localeCode } = params;
        const localeSlug =
            params.localeSlug ??
            (Routing.getShortestLocaleSlug(localeCode as Locale.Code, {
                locales,
                defaultLocale,
            }) ||
                '');

        return normalizeUrl(
            urlPattern.stringify(
                withoutUndefined({
                    ...params,
                    localeCode,
                    localeSlug,
                }),
            ) as `/${string}`,
        );
    }

    return normalizeUrl(urlPattern.stringify(withoutUndefined(params)) as `/${string}`);
}
