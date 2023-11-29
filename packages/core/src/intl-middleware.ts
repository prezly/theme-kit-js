/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Locale } from '@prezly/theme-kit-intl';

import { AsyncResolvable } from './resolvable';
import * as Routing from './routing';

export interface Configuration {
    locales: AsyncResolvable<Locale.Code[]>;
    defaultLocale: AsyncResolvable<Locale.Code>;
}

export type Action =
    | { redirect: string; locale: Locale.Code }
    | { rewrite: string; locale: Locale.Code }
    | { notFound: true; locale: Locale.Code };

export interface Router {
    match(pathname: string, searchParams: URLSearchParams): Awaitable<Match | undefined>;
}

export interface Match {
    params: Params & { localeCode: Locale.Code; localeSlug: Locale.AnySlug };
    route: Route;
}

export interface Route {
    generate(params: Params): string;
    rewrite(params: Params): string;
}

type Params = Record<string, string>;

type Awaitable<T> = T | Promise<T> | PromiseLike<T>;

export function create(createRouter: () => Router, config: Configuration) {
    return async (
        pathname: string,
        searchParams: URLSearchParams,
        origin: string,
    ): Promise<Action> => {
        const router = createRouter();

        const [locales, defaultLocale] = await AsyncResolvable.resolve(
            config.locales,
            config.defaultLocale,
        );

        const matched = await router.match(pathname, searchParams);

        if (matched) {
            const { params } = matched;

            if (params.localeSlug && params.localeCode) {
                // If there is :localeSlug, and it is resolved to the default newsroom locale -- remove it.
                if (params.localeCode === defaultLocale) {
                    const redirect = matched.route.generate({
                        ...params,
                        localeSlug: undefined,
                    } as any);
                    return {
                        redirect: new URL(redirect, origin).toString(),
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
                    } as any);

                    return {
                        redirect: new URL(redirect, origin).toString(),
                        locale: params.localeCode ?? defaultLocale,
                    };
                }
            }

            return {
                rewrite: new URL(matched.route.rewrite(matched.params as any), origin).toString(),
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
    };
}
