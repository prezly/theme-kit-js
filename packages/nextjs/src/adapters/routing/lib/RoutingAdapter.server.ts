/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Router, RoutesMap, UrlGenerator } from '@prezly/theme-kit-core';
import { AsyncResolvable, Routing } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

export namespace RoutingAdapter {
    export type Configuration = {
        locales: AsyncResolvable<Locale.Code[]>;
        defaultLocale: AsyncResolvable<Locale.Code>;
        toLocaleSlug?: (locale: Locale.Code) => Locale.UrlSlug;
    };

    export function connect<Routes extends RoutesMap>(
        createRouter: () => Router<Routes>,
        config: Configuration,
    ) {
        async function useRouting(): Promise<{
            router: Router<Routes>;
            generateUrl: UrlGenerator<Router<Routes>>;
        }> {
            const router = createRouter();
            const [locales, defaultLocale] = await AsyncResolvable.resolve(
                config.locales,
                config.defaultLocale,
            );

            return {
                router,
                generateUrl(routeName: keyof Routes, params = {}) {
                    return Routing.generateUrlFromPattern(
                        router.routes[routeName].pattern as `/${string}`,
                        params as any,
                        { defaultLocale, locales, toLocaleSlug: config.toLocaleSlug },
                    );
                },
            };
        }

        return { useRouting };
    }
}
