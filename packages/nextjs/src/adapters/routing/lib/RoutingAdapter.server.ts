/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Router, RoutesMap, UrlGenerator } from '@prezly/theme-kit-core';
import { AsyncResolvable, Routing } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

export namespace RoutingAdapter {
    export type Configuration = {
        locales: Locale.Code[];
        defaultLocale: Locale.Code;
        toLocaleSlug?: (
            locale: Locale.Code,
            context: Pick<Configuration, 'locales' | 'defaultLocale'>,
        ) => Locale.UrlSlug;
        origin: `http://${string}` | `https://${string}`;
    };

    export function connect<Routes extends RoutesMap>(
        createRouter: () => Router<Routes>,
        config: AsyncResolvable<Configuration>,
    ) {
        async function useRouting(): Promise<{
            router: Router<Routes>;
            generateUrl: UrlGenerator<Router<Routes>>;
            generateAbsoluteUrl: UrlGenerator.Absolute<Router<Routes>>;
        }> {
            const router = createRouter();
            const { locales, defaultLocale, toLocaleSlug, origin } =
                await AsyncResolvable.resolve(config);

            return {
                router,
                generateUrl(routeName: keyof Routes, params = {}) {
                    return Routing.generateUrlFromPattern(
                        router.routes[routeName].pattern as `/${string}`,
                        params as any,
                        { defaultLocale, locales, toLocaleSlug },
                    );
                },
                generateAbsoluteUrl(routeName: keyof Routes, params = {}) {
                    const url = Routing.generateUrlFromPattern(
                        router.routes[routeName].pattern as `/${string}`,
                        params as any,
                        { defaultLocale, locales, toLocaleSlug },
                    );
                    return `${origin}${url}`;
                },
            };
        }

        return { useRouting };
    }
}
