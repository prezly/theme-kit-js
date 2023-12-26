/* eslint-disable @typescript-eslint/no-redeclare */
import UrlPattern from 'url-pattern';

import type { ExtractPathParams } from './types';
import { normalizeUrl } from './utils';

export type Route<Pattern = string, Match = unknown> = {
    /**
     * Route match pattern.
     */
    pattern: Pattern;

    /**
     * Match incoming request path and search params against the route definition.
     */
    match(path: string, searchParams: URLSearchParams): Promise<Match | undefined>;

    /**
     * Low-level route URL generator.
     * Unaware of newsroom locales and how to shorten locale slugs.
     */
    generate(params: Match): `/${string}`;

    /**
     * Rewrite external route URL to the internal unambiguous pages layout URL.
     */
    rewrite(params: Match): string;
};

export namespace Route {
    export interface Options<Pattern extends string, Match> {
        check?(match: Match, searchParams: URLSearchParams): boolean;
        generate?(pattern: UrlPattern, params: ExtractPathParams<Pattern>): `/${string}`;
    }

    export function create<
        Pattern extends `/${string}` | `(/:${string})/${string}`,
        Match extends ExtractPathParams<Pattern>,
    >(
        pattern: Pattern,
        rewrite: string,
        { check, generate }: Options<Pattern, Match> = {},
    ): Route<Pattern, Match> {
        const urlPattern = new UrlPattern(pattern);
        const rewritePattern = new UrlPattern(rewrite);

        return {
            pattern,
            async match(path: string, searchParams: URLSearchParams) {
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
        };
    }
}
