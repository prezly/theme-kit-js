import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { AsyncResolvable, Routing } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import { headers, type UnsafeUnwrappedHeaders } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { slugs } from './slugs';

export type Configuration = {
    router: Router;

    /**
     * The newsroom default locale.
     */
    defaultLocale: AsyncResolvable<Locale.Code>;

    /**
     * Locale codes in the order of preference (in case of locale slug ambiguity).
     */
    locales: AsyncResolvable<Locale.Code[]>;

    /**
     * Map locale to its URL slug. This will override the locale
     * slug shortening logic we have implemented by default.
     * See [CARE-3532].
     */
    toLocaleSlug?(
        locale: Locale.Code,
        context: {
            defaultLocale: Locale.Code;
            locales: Locale.Code[];
        },
    ): Locale.UrlSlug;

    /**
     * The middleware will attach the request `:localeSlug` parameter to the
     * rewritten request headers. Needed to know the request locale on the
     * "not-found" pages, which do not have access to request path.
     */
    localeCodeHeader?: string;
};

type Awaitable<T> = T | Promise<T> | PromiseLike<T>;

export type Router = {
    match(
        pathname: string,
        searchParams: URLSearchParams,
        context: {
            isSupportedLocale(locale: string): boolean;
        },
    ): Match | undefined;
};

export type Route = {
    generate(params: Params): string;
    rewrite(params: Params): string;
    resolveLocale?(params: Params): Awaitable<Locale.Code | undefined>;
};

type Params = Record<string, unknown>;

type Match = {
    route: Route;
    params: Params & { localeSlug?: string };
};

/** @see Configuration.localeCodeHeader */
export const DEFAULT_LOCALE_CODE_HEADER = 'X-Prezly-Locale-Code';

/** @see Configuration.requestOriginHeader */
export const DEFAULT_REQUEST_ORIGIN_HEADER = 'X-Prezly-Request-Origin';

export async function handle(request: NextRequest, config: Configuration) {
    const {
        router,
        localeCodeHeader = DEFAULT_LOCALE_CODE_HEADER,
        toLocaleSlug = Routing.getShortestLocaleSlug,
    } = config;

    const [defaultLocale, locales] = await AsyncResolvable.resolve(
        config.defaultLocale,
        config.locales,
    );

    const { pathname, searchParams } = request.nextUrl;

    const match = router.match(pathname, searchParams, {
        isSupportedLocale(localeSlug) {
            return Boolean(Routing.matchLocaleSlug(localeSlug, locales));
        },
    }) as Match | undefined;

    // The request URL does not match the routing schema
    if (!match) {
        // Maybe, we can pull the first `/xx/` portion and use it for Intl.
        const [possiblyLocaleSlug = ''] = pathname.split('/').filter(Boolean);

        const localeCode =
            (isTheoreticallySupportedLocaleSlug(possiblyLocaleSlug)
                ? Routing.matchLocaleSlug(possiblyLocaleSlug, locales)
                : undefined) ??
            // or just fallback to the default one
            defaultLocale;

        return NextResponse.rewrite(new URL(`/${localeCode}/_error404`, request.nextUrl), {
            headers: {
                [localeCodeHeader]: localeCode,
            },
        });
    }

    const localeSlug = match.params.localeSlug || undefined; // convert empty string to `undefined`

    const localeCode =
        (match.route.resolveLocale ? await match.route.resolveLocale(match.params) : undefined) ??
        (localeSlug ? Routing.matchLocaleSlug(localeSlug, locales) : undefined) ??
        defaultLocale;

    const expectedLocaleSlug = toLocaleSlug(localeCode, { locales, defaultLocale }) || undefined; // convert `false` to `undefined`

    // The locale slug is not matching the expected shortest code.
    // Redirect to the right URL.
    if (localeSlug && localeSlug !== expectedLocaleSlug) {
        const redirect = match.route.generate({ ...match.params, localeSlug: expectedLocaleSlug });
        return NextResponse.redirect(new URL(redirect, request.nextUrl));
    }

    // Rewrite the URl to route it to the right internal page path
    const rewrite = match.route.rewrite({ localeCode, ...match.params });
    const rewriteUrl = new URL(rewrite, request.nextUrl);

    searchParams.forEach((value, key) => {
        rewriteUrl.searchParams.set(key, value);
    });

    return NextResponse.rewrite(rewriteUrl, {
        headers: {
            [localeCodeHeader]: localeCode,
        },
    });
}

export interface LocaleMatchContext {
    /**
     * Newsroom languages configuration.
     */
    languages: Pick<NewsroomLanguageSettings, 'code' | 'is_default' | 'public_stories_count'>[];

    /**
     * Expected URL for the current page.
     */
    generateUrl: (localeCode: Locale.Code) => string;

    /**
     * Map locale to its URL slug. This will override the locale
     * slug shortening logic we have implemented by default.
     * See [CARE-3532].
     */
    toLocaleSlug?(
        locale: Locale.Code,
        context: {
            defaultLocale: Locale.Code;
            locales: Locale.Code[];
        },
    ): Locale.UrlSlug;
}

/**
 * Get the locale code attached to the request headers.
 *
 * WARNING: Calling this function will opt out of Next.js optimizations.
 * Only call it when absolutely necessary.
 * See https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-functions
 *
 * The only currently foreseen use-case for this function is rendering
 * a 404 page in the right locale, as not-found error pages do not have
 * access to the request URL, like normal pages.
 * See https://nextjs.org/docs/app/api-reference/file-conventions/not-found#props
 */
export function getLocaleCodeFromHeader(
    localeCodeHeader = DEFAULT_LOCALE_CODE_HEADER,
): Locale.Code | undefined {
    const code = (headers() as unknown as UnsafeUnwrappedHeaders).get(localeCodeHeader);

    if (code === null) {
        throw new Error(
            'Locale code header is not set. Please check if the middleware is configured properly.',
        );
    }

    return Locale.from(code).code || undefined; // convert empty string to `undefined`
}

function isTheoreticallySupportedLocaleSlug(localeSlug: string): boolean {
    return slugs.includes(localeSlug);
}
