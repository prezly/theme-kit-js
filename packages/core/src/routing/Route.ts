/* eslint-disable @typescript-eslint/no-redeclare */
import type { Locale } from '@prezly/theme-kit-intl';
import UrlPattern from 'url-pattern';

import type { Awaitable, ExtractPathParams } from './types';
import { normalizeUrl } from './utils';

export type Route<Pattern = string, Match = unknown> = {
    /**
     * Route match pattern.
     */
    pattern: Pattern;

    /**
     * Match incoming request path and search params against the route definition.
     */
    match(
        path: string,
        searchParams: URLSearchParams,
        context: Route.MatchContext,
    ): Promise<(Match & { localeCode: Locale.Code }) | undefined>;

    /**
     * Low-level route URL generator.
     * Unaware of newsroom locales and how to shorten locale slugs.
     */
    generate(params: Match): `/${string}`;

    /**
     * Rewrite external route URL to the internal unambiguous pages layout URL.
     */
    rewrite(params: Match & { localeCode: Locale.Code }): string;
};

export namespace Route {
    export interface MatchContext {
        getDefaultLocale(): Awaitable<Locale.Code>;
        resolveLocaleSlug(localeSlug: Locale.AnySlug): Awaitable<Locale.Code | undefined>;
    }

    export interface Options<Pattern extends string, Match> {
        check?(match: Match, searchParams: URLSearchParams): boolean;
        generate?(pattern: UrlPattern, params: ExtractPathParams<Pattern>): `/${string}`;
        resolveImplicitLocale?(match: Match): Awaitable<Locale.Code | undefined>;
    }

    export function create<
        Pattern extends `/${string}` | `(/:${string})/${string}`,
        Match extends ExtractPathParams<Pattern>,
    >(
        pattern: Pattern,
        rewrite: string,
        { check, generate, resolveImplicitLocale }: Options<Pattern, Match> = {},
    ): Route<Pattern, Match> {
        const urlPattern = new UrlPattern(pattern);
        const rewritePattern = new UrlPattern(rewrite);

        return {
            pattern,
            async match(
                path: string,
                searchParams: URLSearchParams,
                { getDefaultLocale, resolveLocaleSlug },
            ) {
                const matched: Record<string, string | undefined> = urlPattern.match(path);

                if (!matched) {
                    return undefined;
                }

                if (check && !check(matched as Match, searchParams)) {
                    return undefined;
                }

                const localeCode =
                    matched.localeCode ??
                    (await resolveImplicitLocale?.(matched as Match)) ??
                    (matched.localeSlug
                        ? await resolveLocaleSlug(matched.localeSlug)
                        : await getDefaultLocale());

                if (!localeCode) {
                    return undefined;
                }

                return {
                    ...(matched as Match & Record<string, unknown>),
                    localeCode: localeCode as Locale.Code,
                };
            },
            generate(params: Match) {
                if (generate) {
                    return normalizeUrl(generate(urlPattern, params));
                }
                return normalizeUrl(urlPattern.stringify(params) as `/${string}`);
            },
            rewrite(params: Match & { localeCode: Locale.Code }) {
                return rewritePattern.stringify(params);
            },
        };
    }
}
