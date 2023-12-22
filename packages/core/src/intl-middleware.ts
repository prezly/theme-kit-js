/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Locale } from '@prezly/theme-kit-intl';

import { Routing } from './routing';

export interface Context {
    locales: Locale.Code[];
    defaultLocale: Locale.Code;
}

export type Action =
    | { redirect: `/${string}`; locale: Locale.Code }
    | { rewrite: `/${string}`; locale: Locale.Code }
    | { notFound: true; locale: Locale.Code };

export interface Router {
    match(pathname: string, searchParams: URLSearchParams): Awaitable<Match | undefined>;
}

export interface Match {
    params: Params & { localeCode: Locale.Code; localeSlug?: Locale.AnySlug };
    route: Route;
}

export interface Route {
    generate(params: Params): string;
    rewrite(params: Params): string;
}

type Params = Record<string, string>;

type Awaitable<T> = T | Promise<T> | PromiseLike<T>;

export async function handle(
    router: Router,
    pathname: string,
    searchParams: URLSearchParams,
    { locales, defaultLocale }: Context,
): Promise<Action> {
    const matched = await router.match(pathname, searchParams);

    if (matched) {
        const { params } = matched;

        if (params.localeSlug) {
            // If there is :localeSlug, and it is resolved to the default newsroom locale -- remove it.
            if (params.localeCode === defaultLocale) {
                const redirect = matched.route.generate({
                    ...params,
                    localeSlug: undefined,
                } as any) as `/${string}`;
                return {
                    redirect,
                    locale: params.localeCode,
                };
            }

            const expectedLocaleSlug = Routing.getShortestLocaleSlug(params.localeCode, {
                locales,
                defaultLocale,
            });

            // If there is :localeSlug, and it is not matching the expected shortest locale slug -- redirect.
            if (expectedLocaleSlug && expectedLocaleSlug !== params.localeSlug) {
                const redirect = matched.route.generate({
                    ...params,
                    localeSlug: expectedLocaleSlug,
                } as any) as `/${string}`;

                return {
                    redirect,
                    locale: params.localeCode ?? defaultLocale,
                };
            }
        }

        return {
            rewrite: matched.route.rewrite(matched.params as any) as `/${string}`,
            locale: params.localeCode,
        };
    }

    const possiblyLocaleSlug = pathname.split('/').filter(Boolean)[0] ?? '';
    const localized = await router.match(`/${possiblyLocaleSlug}`, searchParams);

    if (localized) {
        return {
            notFound: true,
            locale: localized.params.localeCode,
        };
    }

    return {
        notFound: true,
        locale: defaultLocale,
    };
}
