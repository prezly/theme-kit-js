/* eslint-disable @typescript-eslint/no-use-before-define */
import { AsyncResolvable } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

import { generateUrlFromPattern } from './generateUrlFromPattern';
import type { Router, RoutesMap, UrlGenerator } from './types';

export namespace RoutingAdapter {
    export interface Configuration {
        locales: Locale.Code[];
        defaultLocale: Locale.Code;
    }

    export function connect<Routes extends RoutesMap>(
        createRouter: () => Router<Routes>,
        config: AsyncResolvable<Configuration>,
    ) {
        async function useRouting(): Promise<{
            router: Router<Routes>;
            generateUrl: UrlGenerator<Router<Routes>>;
        }> {
            const router = createRouter();
            const { locales, defaultLocale } = await AsyncResolvable.resolve(config);

            return {
                router,
                generateUrl(routeName: keyof Routes, params = {}) {
                    return generateUrlFromPattern(
                        router.routes[routeName].pattern as `/${string}`,
                        params as any,
                        {
                            defaultLocale,
                            locales,
                        },
                    );
                },
            };
        }

        return { useRouting };
    }
}
