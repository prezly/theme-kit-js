/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NewsroomLanguageSettings } from '@prezly/sdk';
import type { Route, Router } from '@prezly/theme-kit-core';
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
     * Checks if the string matched by the `:localeSlug` URL parameter
     * can map to any supported locale. This is necessary to resolve
     * routes collisions (e.g. `/:storySlug` vs `/:localeSlug`).
     *
     * The default is to check against all possible locale slugs.
     * @see slugs.ts
     */
    isSupportedLocale?(locale: string): boolean;
    /**
     * Map locale to its URL slug. This will override the locale
     * slug shortening logic we have implemented by default.
     * See [CARE-3532].
     */
    toLocaleSlug(locale: Locale.Code): Locale.UrlSlug;
};

type Match = {
    route: Route;
    params: Record<string, unknown> & { localeSlug?: string };
};

/**
 * @see Configuration.localeSlugHeader
 */
export const DEFAULT_LOCALE_SLUG_HEADER = 'X-Prezly-Locale-Slug';

/**
 * A magic string that will be used when a route
 * without `:localeSlug` parameter matched is accessed.
 */
export const X_DEFAULT_LOCALE_SLUG = 'x-default';

export function create<T extends Router>(router: Resolvable<T>, config: Configuration) {
    const { localeSlugHeader = DEFAULT_LOCALE_SLUG_HEADER } = config;

    return async (request: NextRequest) => {
        const { pathname, searchParams } = request.nextUrl;
        const { isSupportedLocale = isTheoreticallySupportedLocaleSlug } = config;

        const match = Resolvable.resolve(router).match(pathname, searchParams, {
            isSupportedLocale,
        }) as Match | undefined;

        if (match) {
            const localeSlug = match.params.localeSlug ?? X_DEFAULT_LOCALE_SLUG;
            const rewrite = match.route.rewrite({ ...match.params, localeSlug });
            return NextResponse.rewrite(new URL(rewrite, request.nextUrl), {
                headers: {
                    [localeSlugHeader]: localeSlug,
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
            },
        });
    };
}

export type LocaleMatch = { redirect: string } | { notFound: true } | { locale: Locale.Code };

export interface LocaleMatchContext {
    languages: AsyncResolvable<
        Pick<NewsroomLanguageSettings, 'code' | 'is_default' | 'public_stories_count'>[]
    >;
    generateUrl: (locale: Locale.Code) => string | undefined;
}

/**
 * Check the current `:localeSlug` parameter and match it against the newsroom configuration.
 *
 * One of the following will happen:
 * - the matched locale will be returned
 * - a REDIRECT will be performed
 * - a NOT FOUND error will be thrown
 *
 * This function is expected to be called in EVERY page render,
 * as we cannot use any API-data-dependent logic in the middleware.
 *
 * See <Challenge I> in [DEV-12250]
 */
export async function handleLocaleSlug(
    localeSlug: Locale.AnySlug | typeof X_DEFAULT_LOCALE_SLUG,
    context: LocaleMatchContext,
): Promise<Locale.Code> {
    const match = await matchLocaleSlug(localeSlug, context);

    if ('notFound' in match) {
        notFound();
    }

    if ('redirect' in match) {
        redirect(match.redirect);
    }

    return match.locale;
}

/**
 * @internal
 *
 * Match the current `:localeSlug` parameter and against the newsroom configuration.
 *
 * One of the following results will be returned:
 * - `{ locale: Locale.Code }` if the locale slug has been successfully matched
 * - `{ redirect: string }` if the locale slug has been matched, but does not comply with locale slug shortening rules.
 * - `{ notFound: true }` if the locale slug has not been matched
 */
async function matchLocaleSlug(
    localeSlug: Locale.AnySlug | typeof X_DEFAULT_LOCALE_SLUG,
    { generateUrl, ...context }: LocaleMatchContext,
): Promise<LocaleMatch> {
    const languages = await AsyncResolvable.resolve(context.languages);
    const [defaultLocale] = languages.filter((lang) => lang.is_default).map((lang) => lang.code);
    const locales = languages.map((lang) => lang.code);

    if (localeSlug === X_DEFAULT_LOCALE_SLUG) {
        // URLs without a `localeSlug` produce `x-default` localeSlug value,
        // which should map to the newsroom default locale. We cannot just put
        // the newsroom default locale, as we don't have access to the newsroom
        // settings in the middleware. See <Challenge I> in [DEV-12250]
        return { locale: defaultLocale };
    }

    const locale = Routing.matchLanguageByLocaleSlug(languages, localeSlug);

    if (!locale) {
        // localeSlug does not match to a supported locale that is enabled on the newsroom.
        return { notFound: true };
    }

    const shortestLocaleSlug = Routing.getShortestLocaleSlug(locale.code, {
        locales,
        defaultLocale,
    });

    if (!shortestLocaleSlug) {
        // It is the default locale, which should not have localeSlug in the URL,
        // but it is present in the URL. Redirect to the right URL.
        const url = generateUrl(locale.code);
        return url ? { redirect: url } : { notFound: true };
    }

    if (shortestLocaleSlug !== localeSlug) {
        // The locale slug is not matching the expected shortest code.
        // Redirect to the right URL.
        const url = generateUrl(locale.code);
        return url ? { redirect: url } : { notFound: true };
    }

    return { locale: locale.code };
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

function isTheoreticallySupportedLocaleSlug(localeSlug: string): boolean {
    return slugs.includes(localeSlug);
}
