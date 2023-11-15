/* eslint-disable @typescript-eslint/no-use-before-define */
import { Routing } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

import { type AsyncResolvable, resolveAsync } from '#utils';

import type { Router, RoutesMap, UrlGenerator } from './types';

export namespace RoutingAdapter {
    export interface Configuration {
        locales: Locale.Code[];
        defaultLocale: Locale.Code;
        activeLocale: Locale.Code;
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
            const { locales, defaultLocale, activeLocale } = await resolveAsync(config);

            return {
                router,
                generateUrl(routeName: keyof Routes, params = {}) {
                    const localeCode: Locale.Code = (params as any).localeCode ?? activeLocale;
                    const localeSlug =
                        Routing.getShortestLocaleSlug(localeCode, { locales, defaultLocale }) ||
                        undefined;

                    // @ts-ignore
                    return router.generate(routeName, { localeCode, localeSlug, ...params });
                },
            };
        }

        return { useRouting };
    }
}
