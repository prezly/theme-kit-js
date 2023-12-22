import type { NewsroomLanguageSettings } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';

import { AsyncResolvable } from '../resolvable';

import type { Route } from './Route';
import { matchLanguageByLocaleSlug } from './utils';

export type RoutesMap<T extends Route = Route> = Record<string, T>;

export interface Router<Routes extends RoutesMap = RoutesMap> {
    routes: Routes;

    match(
        path: string,
        searchParams: URLSearchParams,
    ): {
        [RouteName in keyof Routes]: Routes[RouteName] extends Route<string, infer Match>
            ? Promise<
                  | { params: Match & { localeCode: Locale.Code }; route: Route<string, Match> }
                  | undefined
              >
            : undefined;
    }[keyof Routes];

    generate<RouteName extends keyof Routes>(
        routeName: RouteName,
        ...params: Routes[RouteName] extends Route<string, infer Match>
            ? {} extends Match
                ? [Match] | []
                : [Match]
            : never
    ): `/${string}`;

    dump(): {
        [RouteName in keyof Routes]: Routes[RouteName]['pattern'];
    };
}

export namespace Router {
    export interface Configuration {
        languages: AsyncResolvable<
            Pick<NewsroomLanguageSettings, 'code' | 'is_default' | 'public_stories_count'>[]
        >;
    }

    export function create<Routes extends RoutesMap>(
        routes: Routes,
        config: Configuration,
    ): Router<Routes> {
        return {
            routes,

            async match(path: string, searchParams: URLSearchParams) {
                async function resolveDefaultLocale() {
                    const languages = await AsyncResolvable.resolve(config.languages);
                    const defaultLanguage = languages.find((lang) => lang.is_default);
                    if (!defaultLanguage) {
                        throw new Error(
                            'It is expected that the languages list always contains a default language.',
                        );
                    }
                    return defaultLanguage.code;
                }

                async function resolveLocaleSlug(localeSlug: string) {
                    const languages = await AsyncResolvable.resolve(config.languages);
                    return matchLanguageByLocaleSlug(languages, localeSlug)?.code;
                }

                const matches = await Promise.all(
                    Object.values(routes).map(async (route) => {
                        const params = await route.match(path, searchParams, {
                            getDefaultLocale: resolveDefaultLocale,
                            resolveLocaleSlug,
                        });
                        if (params) {
                            return { params, route };
                        }
                        return undefined;
                    }),
                );

                const [first] = matches.filter(Boolean);
                return first;
            },

            generate(routeName, params = {}) {
                return routes[routeName].generate(params);
            },

            dump() {
                return Object.fromEntries(
                    Object.entries(routes).map(([routeName, route]) => [routeName, route.pattern]),
                );
            },
        } as Router<Routes>;
    }
}
