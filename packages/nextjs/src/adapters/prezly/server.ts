/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Newsroom, NewsroomTheme, Story } from '@prezly/sdk';
import { createPrezlyClient } from '@prezly/sdk';
import { CachedFetch, ContentDelivery } from '@prezly/theme-kit-core';

import { type Resolvable, resolve } from '../../utils';

type Fetch = typeof fetch;

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

    export interface CacheConfiguration {
        ttl?: CachedFetch.Options['ttl'];
        fetch?: Fetch;
    }

    export const DEFAULT_REQUEST_CACHE_TTL = 10000;

    export function connect(
        config: Resolvable<Configuration>,
        cacheConfig: CacheConfiguration = {},
    ) {
        const cachedFetch = CachedFetch.create({
            ttl: cacheConfig.ttl ?? DEFAULT_REQUEST_CACHE_TTL,
            fetch: cacheConfig.fetch,
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
            } = resolve(config);

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
