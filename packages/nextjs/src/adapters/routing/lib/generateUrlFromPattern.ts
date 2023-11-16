/* eslint-disable @typescript-eslint/no-use-before-define */
import { Routing } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import UrlPattern from 'url-pattern';

import { withoutUndefined } from '../../../utils';

import { normalizeUrl } from './normalizeUrl';

export interface Context {
    locale: Locale.Code;
    locales: Locale.Code[];
    defaultLocale: Locale.Code;
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
        const { locale, locales, defaultLocale } = context;

        const localeCode: Locale.Code = params.localeCode ?? locale;
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
