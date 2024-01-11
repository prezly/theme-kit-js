/* eslint-disable @typescript-eslint/no-redeclare */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import UrlPattern from 'url-pattern';

import { AsyncResolvable } from '../resolvable';

import type { ExtractPathParams } from './types';
import { matchLanguageByLocaleSlug, normalizeUrl } from './utils';

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
     * Resolve locale code from the request parameters.
     */
    resolveLocale(
        params: Match,
        context: Route.LocaleResolutionContext,
    ): Awaitable<Locale.Code | undefined>;
};

export namespace Route {
    export interface Options<Pattern extends string, Match> {
        check?(match: Match, searchParams: URLSearchParams): boolean;
        generate?(pattern: UrlPattern, params: ExtractPathParams<Pattern>): `/${string}`;
        resolveLocale?(params: ExtractPathParams<Pattern>): Awaitable<Locale.Code | undefined>;
    }

    export interface LocaleResolutionContext {
        languages: AsyncResolvable<
            Pick<NewsroomLanguageSettings, 'code' | 'is_default' | 'public_stories_count'>[]
        >;
    }

    export function create<
        Pattern extends `/${string}` | `(/:${string})/${string}`,
        Match extends ExtractPathParams<Pattern>,
    >(
        pattern: Pattern,
        rewrite: string,
        { check, generate, resolveLocale }: Options<Pattern, Match> = {},
    ): Route<Pattern, Match> {
        const urlPattern = new UrlPattern(pattern);
        const rewritePattern = new UrlPattern(rewrite);

        async function defaultResolveLocale(params: Match, context: Route.LocaleResolutionContext) {
            if ('localeSlug' in params && typeof params.localeSlug === 'string') {
                const lang = matchLanguageByLocaleSlug(
                    await AsyncResolvable.resolve(context.languages),
                    params.localeSlug,
                );
                return lang?.code;
            }

            const languages = await AsyncResolvable.resolve(context.languages);
            const [defaultLocale] = languages
                .filter((lang) => lang.is_default)
                .map((lang) => lang.code);

            return defaultLocale;
        }

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
            resolveLocale(params, context) {
                return (resolveLocale ?? defaultResolveLocale)(params, context);
            },
        };
    }
}
