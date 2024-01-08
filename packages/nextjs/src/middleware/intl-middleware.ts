/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { AsyncResolvable, Resolvable, Routing } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { slugs } from './slugs';

export type Configuration = {
    /**
     * The middleware will attach the request `:localeSlug` parameter to the
     * rewritten request headers. Needed to know the request locale on the
     * "not-found" pages, which do not have access to request path.
     */
    localeSlugHeader?: string;

    /**
     * The middleware will attach the request URL `origin` value to the
     * rewritten request headers. This helps to get the request origin
     * (protocol + host) anywhere in the app.
     */
    requestOriginHeader?: string;

    /**
     * Checks if the string matched by the `:localeSlug` URL parameter
     * can map to any supported locale. This is necessary to resolve
     * routes collisions (e.g. `/:storySlug` vs `/:localeSlug`).
     *
     * The default is to check against all possible locale slugs.
     * @see slugs.ts
     */
    isSupportedLocale?(locale: string): boolean;
};

type Awaitable<T> = T | Promise<T> | PromiseLike<T>;

export type Router = {
    match(
        pathname: string,
        searchParams: URLSearchParams,
        context: {
            isSupportedLocale(locale: string): boolean;
        },
    ): Awaitable<Match | undefined>;
};

export type Route = {
    generate(params: Params): string;
    rewrite(params: Params): string;
};

type Params = Record<string, unknown>;

type Match = {
    route: Route;
    params: Params & { localeSlug?: string };
};

/**
 * @see Configuration.localeSlugHeader
 */
export const DEFAULT_LOCALE_SLUG_HEADER = 'X-Prezly-Locale-Slug';
export const DEFAULT_REQUEST_ORIGIN_HEADER = 'X-Prezly-Request-Origin';

/**
 * A magic string that will be used when a route
 * without `:localeSlug` parameter matched is accessed.
 */
export const X_DEFAULT_LOCALE_SLUG = 'x-default';

export function create(router: Resolvable<Router>, config: Configuration = {}) {
    const {
        isSupportedLocale = isTheoreticallySupportedLocaleSlug,
        localeSlugHeader = DEFAULT_LOCALE_SLUG_HEADER,
        requestOriginHeader = DEFAULT_REQUEST_ORIGIN_HEADER,
    } = config;

    return async (request: NextRequest) => {
        const { pathname, searchParams, origin } = request.nextUrl;

        const match = Resolvable.resolve(router).match(pathname, searchParams, {
            isSupportedLocale,
        }) as Match | undefined;

        if (match) {
            const localeSlug = match.params.localeSlug ?? X_DEFAULT_LOCALE_SLUG;
            const rewrite = match.route.rewrite({ ...match.params, localeSlug });
            return NextResponse.rewrite(new URL(rewrite, request.nextUrl), {
                headers: {
                    [localeSlugHeader]: localeSlug,
                    [requestOriginHeader]: origin,
                },
            });
        }

        const possiblyLocaleSlug = pathname.split('/').filter(Boolean)[0] ?? '';
        if (isSupportedLocale(possiblyLocaleSlug)) {
            return NextResponse.rewrite(new URL(`/${possiblyLocaleSlug}/404`, request.nextUrl), {
                headers: {
                    [localeSlugHeader]: possiblyLocaleSlug,
                },
            });
        }

        return NextResponse.rewrite(new URL(`/${X_DEFAULT_LOCALE_SLUG}/404`, request.nextUrl), {
            headers: {
                [localeSlugHeader]: X_DEFAULT_LOCALE_SLUG,
                [requestOriginHeader]: origin,
            },
        });
    };
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
 * Check the current `:localeSlug` parameter and match it against the newsroom configuration.
 *
 * One of the following will happen:
 * - the matched locale will be returned
 * - a REDIRECT will be performed
 * - a NOT FOUND error will be thrown
 *
 * This function is expected to be called in EVERY page render component,
 * as we cannot move it into the middleware.
 * See <Challenge I> in [DEV-12250]
 */
export async function handleLocaleSlug(
    localeSlug: Locale.AnySlug | typeof X_DEFAULT_LOCALE_SLUG,
    context: AsyncResolvable<LocaleMatchContext>,
): Promise<Locale.Code> {
    const {
        languages,
        generateUrl,
        toLocaleSlug = Routing.getShortestLocaleSlug,
    } = await AsyncResolvable.resolve(context);
    const locales = languages.map((lang) => lang.code);
    const [defaultLocale] = languages.filter((lang) => lang.is_default).map((lang) => lang.code);

    const locale = await matchLocaleSlug(localeSlug, { languages });

    if (!locale) {
        // localeSlug does not match to a supported locale that is enabled on the newsroom.
        notFound();
    }

    const expectedLocaleSlug =
        toLocaleSlug(locale, { locales, defaultLocale }) || X_DEFAULT_LOCALE_SLUG; // convert `false` to "x-default"

    if (localeSlug !== expectedLocaleSlug) {
        // The locale slug is not matching the expected shortest code.
        // Redirect to the right URL.
        redirect(generateUrl(locale));
    }

    return locale;
}

/**
 * Match the current `:localeSlug` parameter and against the newsroom configuration.
 * Returns `undefined` if no locale was matched from the newsroom enabled languages settings.
 */
export async function matchLocaleSlug(
    localeSlug: Locale.AnySlug | typeof X_DEFAULT_LOCALE_SLUG,
    context: {
        languages: AsyncResolvable<
            Pick<NewsroomLanguageSettings, 'code' | 'is_default' | 'public_stories_count'>[]
        >;
    },
): Promise<Locale.Code | undefined> {
    const languages = await AsyncResolvable.resolve(context.languages);
    const [defaultLocale] = languages.filter((lang) => lang.is_default).map((lang) => lang.code);

    if (localeSlug === X_DEFAULT_LOCALE_SLUG) {
        // URLs without a `localeSlug` produce `x-default` localeSlug value,
        // which should map to the newsroom default locale. We cannot just put
        // the newsroom default locale, as we don't have access to the newsroom
        // settings in the middleware. See <Challenge I> in [DEV-12250]
        return defaultLocale;
    }

    return Routing.matchLanguageByLocaleSlug(languages, localeSlug)?.code;
}

/**
 * Get the locale slug attached to the request headers.
 *
 * WARNING: Calling this function will opt out of Next.js optimizations.
 * Only call it when absolutely necessary.
 * See https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-functions
 *
 * The only currently foreseen use-case for this function is rendering
 * a 404 page in the right locale, as not-found error pages do not have access
 * to the request URL, like normal pages.
 * See https://nextjs.org/docs/app/api-reference/file-conventions/not-found#props
 */
export function getLocaleSlugFromHeader(
    localeSlugHeader = DEFAULT_LOCALE_SLUG_HEADER,
): Locale.AnySlug | undefined {
    const code = headers().get(localeSlugHeader);

    if (code === null) {
        throw new Error(
            'Locale slug header is not set. Please check if the middleware is configured properly.',
        );
    }

    return code || undefined; // convert empty string to `undefined`
}

export function getRequestOriginFromHeader(requestOriginHeader = DEFAULT_REQUEST_ORIGIN_HEADER) {
    const origin = headers().get(requestOriginHeader);

    if (origin === null) {
        throw new Error(
            `Request origin header (${requestOriginHeader}) is not set. Please check if the middleware is configured properly.`,
        );
    }

    return origin as `http://${string}` | `https://${string}`;
}

function isTheoreticallySupportedLocaleSlug(localeSlug: string): boolean {
    return slugs.includes(localeSlug);
}
