/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Newsroom, NewsroomTheme, Story } from '@prezly/sdk';
import { createPrezlyClient } from '@prezly/sdk';
import { CachedFetch, ContentDelivery, Resolvable } from '@prezly/theme-kit-core';

export namespace PrezlyAdapter {
    export interface Configuration {
        accessToken: string;
        newsroom: Newsroom['uuid'];
        theme?: NewsroomTheme['id'];
        baseUrl?: string;
        headers?: Record<string, string>;
        pinning?: boolean;
        formats?: Story.FormatVersion[];
    }

    export type CacheConfiguration = Partial<CachedFetch.Options>;

    export const DEFAULT_REQUEST_CACHE_TTL = 10000;
    export const DEFAULT_CACHED_METHODS = ['GET', 'POST'];

    export function connect(
        config: Resolvable<Configuration>,
        cacheConfig: CacheConfiguration = {},
    ) {
        const cachedFetch = CachedFetch.create({
            ...cacheConfig,
            ttl: cacheConfig.ttl ?? DEFAULT_REQUEST_CACHE_TTL,
            methods: cacheConfig.methods ?? DEFAULT_CACHED_METHODS,
        });

        function usePrezlyClient() {
            const {
                // sdk client properties
                accessToken,
                baseUrl,
                headers,
                // contentDelivery client properties
                newsroom,
                theme,
                pinning,
                formats,
            } = Resolvable.resolve(config);

            const client = createPrezlyClient({
                fetch: cachedFetch,
                accessToken,
                baseUrl,
                headers,
            });
            const contentDelivery = ContentDelivery.createClient(client, newsroom, theme, {
                pinning,
                formats,
            });

            return { client, contentDelivery };
        }

        return { usePrezlyClient };
    }
}
