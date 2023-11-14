import 'server-only';
import type { Newsroom, NewsroomTheme, Story } from '@prezly/sdk';
import { createPrezlyClient } from '@prezly/sdk';

import { ContentDelivery } from '../../content-delivery';
import { CachedFetch } from '../../http';
import { type Resolvable, resolve } from '../../utils';

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
        ttl?: number;
    }

    export const DEFAULT_REQUEST_CACHE_TTL = 10000;

    export function connect(
        config: Resolvable<Configuration>,
        cacheConfig: CacheConfiguration = {},
    ) {
        const fetch = CachedFetch.create({
            ttl: cacheConfig.ttl ?? DEFAULT_REQUEST_CACHE_TTL,
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

            const client = createPrezlyClient({ fetch, accessToken, baseUrl, headers });
            const contentDelivery = ContentDelivery.createClient(client, newsroom, theme, {
                pinning,
                formats,
            });

            return { client, contentDelivery };
        }

        return { usePrezlyClient };
    }
}
