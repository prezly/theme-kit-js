import type { Locale } from '@prezly/theme-kit-intl';
import UrlPattern from 'url-pattern';

import { URL_PATTERN_SEGMENT_CHARSET } from './constants';
import type { ExtractPathParams } from './types';
import { normalizeUrl } from './utils';
import { encodeWildcard, fromMatch, parseWildcard, stringify } from './utils/wildcard';

type Awaitable<T> = T | Promise<T>;

export type Route<Pattern = string, Match = unknown> = {
    /**
     * Route match pattern.
     */
    pattern: Pattern;

    /**
     * Match incoming request path and search params against the route definition.
     */
    match(path: string, searchParams: URLSearchParams): Match | undefined;

    /**
     * Low-level route URL generator.
     * Unaware of newsroom locales and how to shorten locale slugs.
     */
    generate(params: Match): `/${string}`;

    /**
     * Rewrite external route URL to the internal unambiguous pages layout URL.
     */
    rewrite(params: Match): string;

    /**
     * Manually resolve locale code from the request parameters,
     * if the stock logic is not suitable for the current route.
     */
    resolveLocale?(params: Match): Awaitable<Locale.Code | undefined>;
};

export namespace Route {
    export interface Options<Pattern extends string, Match> {
        check?(match: Match, searchParams: URLSearchParams): boolean;
        generate?(pattern: UrlPattern, params: ExtractPathParams<Pattern>): `/${string}`;
        resolveLocale?: Route<Pattern, Match>['resolveLocale'];
    }

    export function create<
        Pattern extends `/${string}` | `(/:${string})/${string}`,
        Match extends ExtractPathParams<Pattern>,
    >(
        pattern: Pattern,
        rewrite: string,
        { check, generate, resolveLocale }: Options<Pattern, Match> = {},
    ): Route<Pattern, Match> {
        // A pattern can end in a named wildcard (`/category/*path`), which takes several segments.
        const wildcard = parseWildcard(pattern);
        const rewriteWildcard = parseWildcard(rewrite);

        const urlPattern = new UrlPattern(wildcard.pattern, {
            segmentValueCharset: URL_PATTERN_SEGMENT_CHARSET,
        });
        const rewritePattern = new UrlPattern(rewriteWildcard.pattern, {
            segmentValueCharset: URL_PATTERN_SEGMENT_CHARSET,
        });

        function encode(key: string, value: string) {
            return key === wildcard.name ? encodeWildcard(value) : encodeURIComponent(value);
        }

        return {
            pattern,
            match(path: string, searchParams: URLSearchParams) {
                const match: Record<string, string | undefined> | undefined =
                    urlPattern.match(path);

                if (!match) {
                    return undefined;
                }

                const matched = fromMatch(match, wildcard.name);

                // `/category/` is not a category: a wildcard has to have something in it.
                if (wildcard.name && !matched[wildcard.name]) {
                    return undefined;
                }

                if (check?.(matched as Match, searchParams) === false) {
                    return undefined;
                }

                return matched as Match;
            },
            generate(params: Match) {
                const encoded = Object.fromEntries(
                    Object.entries(params ?? {}).map(([key, value]) => [
                        key,
                        typeof value === 'string' ? encode(key, value) : value,
                    ]),
                );
                if (generate) {
                    return normalizeUrl(generate(urlPattern, encoded as Match));
                }
                return normalizeUrl(stringify(urlPattern, encoded, wildcard.name) as `/${string}`);
            },
            rewrite(params: Match) {
                return stringify(rewritePattern, params ?? {}, rewriteWildcard.name);
            },
            resolveLocale,
        };
    }
}
