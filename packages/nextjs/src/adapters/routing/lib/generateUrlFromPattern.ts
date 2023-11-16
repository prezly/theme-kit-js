/* eslint-disable @typescript-eslint/no-use-before-define */
import { Routing } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import UrlPattern from 'url-pattern';

import { withoutUndefined } from '../../../utils';

import { normalizeUrl } from './normalizeUrl';

export interface Context {
    activeLocale: Locale.Code;
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
}

export type Params = Record<string, string | undefined | null> & {
    localeCode?: Locale.Code;
    localeSlug?: Locale.AnySlug | false;
};

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
    params: Params | undefined = {}, // eslint-disable-line @typescript-eslint/default-param-last
    context?: Context,
) {
    const urlPattern = toUrlPattern(pattern);

    if (context) {
        const { activeLocale, locales, defaultLocale } = context;

        const localeCode: Locale.Code = params.localeCode ?? activeLocale;
        const localeSlug =
            (params.localeSlug ??
                Routing.getShortestLocaleSlug(localeCode, { locales, defaultLocale })) ||
            undefined;

        return normalizeUrl(
            urlPattern.stringify({
                localeCode,
                localeSlug,
                ...withoutUndefined(params),
            }) as `/${string}`,
        );
    }

    return normalizeUrl(urlPattern.stringify(withoutUndefined(params)) as `/${string}`);
}
