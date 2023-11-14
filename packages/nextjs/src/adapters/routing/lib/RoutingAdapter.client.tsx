'use client';

import { getShortestLocaleSlug } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';
import UrlPattern from 'url-pattern';

import { withoutUndefined } from '../../../utils';

import { normalizeUrl } from './normalizeUrl';
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

        function useRouting(activeLocale: Locale.Code) {
            const value = useContext(context);

            if (!value) {
                throw new Error(
                    '`useRouting()` requires a RoutingContextProvider defined above the tree, but there is no context provided.',
                );
            }

            const { routes, locales, defaultLocale } = value;

            const languages = useMemo(
                () => locales.map((code) => ({ code, is_default: code === defaultLocale })),
                [locales, defaultLocale],
            );

            const generateUrl = useCallback(
                (routeName: keyof Routes, params: any = {}) => {
                    const pattern = new UrlPattern(routes[routeName]);

                    const localeCode: Locale.Code = params.localeCode ?? activeLocale;
                    const localeSlug: Locale.AnySlug =
                        params.localeSlug ?? getShortestLocaleSlug(languages, localeCode);

                    const href = pattern.stringify({
                        localeCode,
                        localeSlug,
                        ...withoutUndefined(params),
                    });

                    return normalizeUrl(href as `/${string}`);
                },
                [routes, languages, activeLocale],
            ) as UrlGenerator<Router<Routes>>;

            // @ts-ignore
            return { generateUrl };
        }

        return { useRouting, RoutingContextProvider };
    }
}
