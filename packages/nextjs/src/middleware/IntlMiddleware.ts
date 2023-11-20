/* eslint-disable @typescript-eslint/no-use-before-define */
import { Routing } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { Router, RoutesMap } from '../adapters/server';
import { type AsyncResolvable, resolveAsync } from '../utils';

export namespace IntlMiddleware {
    export interface Configuration {
        localeHeader?: string;
        locales: AsyncResolvable<Locale.Code[]>;
        defaultLocale: AsyncResolvable<Locale.Code>;
    }

    export const LOCALE_HEADER = 'X-Prezly-Locale';

    export function create<R extends RoutesMap>(
        createRouter: () => Router<R>,
        config: Configuration,
    ) {
        return async (request: NextRequest) => {
            const router = createRouter();

            const { localeHeader = LOCALE_HEADER } = config;

            const [locales, defaultLocale] = await resolveAsync(
                config.locales,
                config.defaultLocale,
            );

            const { pathname, searchParams } = request.nextUrl;

            const matched = await router.match(pathname, searchParams);

            if (matched) {
                const { params } = matched;

                if ('localeSlug' in params && params.localeSlug) {
                    // If there is :localeSlug, and it is resolved to the default newsroom locale -- remove it.
                    if (params.localeCode === defaultLocale) {
                        return NextResponse.redirect(
                            new URL(
                                matched.route.generate({ ...params, localeSlug: undefined } as any),
                                request.nextUrl,
                            ),
                        );
                    }

                    const expectedLocaleSlug = Routing.getShortestLocaleSlug(params.localeCode, {
                        locales,
                        defaultLocale,
                    });

                    // If there is :localeSlug, and it is not matching the expected shortest locale slug -- redirect.
                    if (expectedLocaleSlug && expectedLocaleSlug !== params.localeSlug) {
                        return NextResponse.redirect(
                            new URL(
                                matched.route.generate({
                                    ...params,
                                    localeSlug: expectedLocaleSlug,
                                } as any),
                                request.nextUrl,
                            ),
                        );
                    }
                }

                return NextResponse.rewrite(
                    new URL(matched.route.rewrite(matched.params as any), request.nextUrl),
                    {
                        headers: {
                            [localeHeader]: matched.params.localeCode,
                        },
                    },
                );
            }

            const possiblyLocaleSlug = pathname.split('/').filter(Boolean)[0] ?? '';
            const localized = await router.match(`/${possiblyLocaleSlug}`, searchParams);

            if (localized) {
                return NextResponse.rewrite(
                    new URL(`/${localized.params.localeCode}/404`, request.nextUrl),
                    {
                        headers: {
                            [localeHeader]: localized.params.localeCode,
                        },
                    },
                );
            }

            return NextResponse.rewrite(new URL(`/${defaultLocale}/404`, request.nextUrl), {
                headers: {
                    [localeHeader]: defaultLocale,
                },
            });
        };
    }

    export function getLocaleFromHeader(localeHeader = IntlMiddleware.LOCALE_HEADER): Locale.Code {
        const code = headers().get(localeHeader);

        if (!code) {
            throw new Error(
                'Locale header is not set. Please check if the middleware is configured properly.',
            );
        }

        // Validate and return
        return Locale.from(code || 'en').code;
    }
}
