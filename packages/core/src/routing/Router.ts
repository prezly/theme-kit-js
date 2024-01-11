import { isNotUndefined } from '@technically/is-not-undefined';

import type { Route } from './Route';

export type RoutesMap<T extends Route = Route> = Record<string, T>;

type Maybe<T> = T | undefined;

export interface Router<Routes extends RoutesMap = RoutesMap> {
    routes: Routes;

    match(
        path: string,
        searchParams: URLSearchParams,
        context: Router.MatchContext,
    ): {
        [RouteName in keyof Routes]: Routes[RouteName] extends Route<infer Pattern, infer Match>
            ? Maybe<{
                  params: Match;
                  route: Route<Pattern, Match>;
              }>
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
    export interface MatchContext {
        isSupportedLocale(code: string): boolean;
    }

    export function create<Routes extends RoutesMap>(routes: Routes): Router<Routes> {
        return {
            routes,

            match(
                path: string,
                searchParams: URLSearchParams,
                { isSupportedLocale }: MatchContext,
            ) {
                const matches = Object.values(routes).map((route) => {
                    const params = route.match(path, searchParams);
                    if (params) {
                        return { params: params as Record<string, unknown>, route };
                    }
                    return undefined;
                });

                const [first] = matches.filter(isNotUndefined).filter(({ params }) => {
                    if ('localeSlug' in params && typeof params.localeSlug === 'string') {
                        return isSupportedLocale(params.localeSlug);
                    }
                    return true;
                });

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
