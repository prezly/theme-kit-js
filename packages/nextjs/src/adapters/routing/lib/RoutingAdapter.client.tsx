'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';

import { generateUrlFromPattern } from './generateUrlFromPattern';
import type { Router, RoutesMap, UrlGenerator } from './types';

interface Context<T extends RoutesMap> {
    routes: {
        [RouteName in keyof T]: T[RouteName]['pattern'];
    };
    locales: Locale.Code[];
    defaultLocale: Locale.Code;
}

export namespace RoutingAdapter {
    export function connect<Routes extends RoutesMap>() {
        const context = createContext<Context<Routes> | undefined>(undefined);

        function RoutingContextProvider(props: Context<Routes> & { children: ReactNode }) {
            const { children, ...value } = props;
            return <context.Provider value={value}>{props.children}</context.Provider>;
        }

        function useRouting(locale: Locale.Code) {
            const value = useContext(context);

            if (!value) {
                throw new Error(
                    '`useRouting()` requires a RoutingContextProvider defined above the tree, but there is no context provided.',
                );
            }

            const { routes, locales, defaultLocale } = value;

            const generateUrl = useCallback(
                (routeName: keyof Routes, params: any = {}) =>
                    generateUrlFromPattern(routes[routeName] as `/${string}`, params, {
                        locale,
                        locales,
                        defaultLocale,
                    }),
                [routes, locales, defaultLocale, locale],
            ) as UrlGenerator<Router<Routes>>;

            // @ts-ignore
            return { generateUrl };
        }

        return { useRouting, RoutingContextProvider };
    }
}
