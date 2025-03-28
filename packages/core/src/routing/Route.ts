import type { Locale } from '@prezly/theme-kit-intl';
import UrlPattern from 'url-pattern';

import { URL_PATTERN_SEGMENT_CHARSET } from './constants';
import type { ExtractPathParams } from './types';
import { normalizeUrl } from './utils';

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
        const urlPattern = new UrlPattern(pattern, {
            segmentValueCharset: URL_PATTERN_SEGMENT_CHARSET,
        });
        const rewritePattern = new UrlPattern(rewrite, {
            segmentValueCharset: URL_PATTERN_SEGMENT_CHARSET,
        });

        return {
            pattern,
            match(path: string, searchParams: URLSearchParams) {
                const matched: Record<string, string | undefined> | undefined =
                    urlPattern.match(path);

                if (!matched) {
                    return undefined;
                }

                if (check?.(matched as Match, searchParams) === false) {
                    return undefined;
                }

                return matched as Match;
            },
            generate(params: Match) {
                if (generate) {
                    return normalizeUrl(generate(urlPattern, params));
                }
                return normalizeUrl(urlPattern.stringify(params) as `/${string}`);
            },
            rewrite(params: Match) {
                return rewritePattern.stringify(params);
            },
            resolveLocale,
        };
    }
}
