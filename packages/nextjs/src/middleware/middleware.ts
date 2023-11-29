/* eslint-disable @typescript-eslint/no-use-before-define */
import { IntlMiddleware } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type Router = IntlMiddleware.Router;
export interface Configuration extends IntlMiddleware.Configuration {
    localeHeader?: string;
}

export const DEFAULT_LOCALE_HEADER = 'X-Prezly-Locale';

export function create(createRouter: () => Router, config: Configuration) {
    const { localeHeader = DEFAULT_LOCALE_HEADER } = config;

    const genericMiddleware = IntlMiddleware.create(createRouter, config);

    return async (request: NextRequest) => {
        const { pathname, searchParams, origin } = request.nextUrl;

        const action = await genericMiddleware(pathname, searchParams, origin);

        if ('redirect' in action) {
            return NextResponse.redirect(action.redirect);
        }

        if ('rewrite' in action) {
            return NextResponse.rewrite(action.rewrite, {
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
