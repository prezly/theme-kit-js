/* eslint-disable @typescript-eslint/no-use-before-define */
import { AsyncResolvable, IntlMiddleware, Resolvable } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type Router = IntlMiddleware.Router;
export interface Configuration extends AsyncResolvable.Properties<IntlMiddleware.Context> {
    localeHeader?: string;
}

export const DEFAULT_LOCALE_HEADER = 'X-Prezly-Locale';

export function create(router: Resolvable<Router>, config: Configuration) {
    const { localeHeader = DEFAULT_LOCALE_HEADER } = config;

    return async (request: NextRequest) => {
        const { pathname, searchParams } = request.nextUrl;

        const [locales, defaultLocale] = await AsyncResolvable.resolve(
            config.locales,
            config.defaultLocale,
        );

        const action = await IntlMiddleware.handle(
            Resolvable.resolve(router),
            pathname,
            searchParams,
            { locales, defaultLocale },
        );

        if ('redirect' in action) {
            return NextResponse.redirect(new URL(action.redirect, request.nextUrl));
        }

        if ('rewrite' in action) {
            return NextResponse.rewrite(new URL(action.rewrite, request.nextUrl), {
                headers: {
                    [localeHeader]: action.locale,
                },
            });
        }
        return NextResponse.rewrite(new URL(`/${action.locale}/404`, request.nextUrl), {
            headers: {
                [localeHeader]: action.locale,
            },
        });
    };
}

export function getLocaleFromHeader(localeHeader = DEFAULT_LOCALE_HEADER): Locale.Code {
    const code = headers().get(localeHeader);

    if (!code) {
        throw new Error(
            'Locale header is not set. Please check if the middleware is configured properly.',
        );
    }

    // Validate and return
    return Locale.from(code || 'en').code;
}
