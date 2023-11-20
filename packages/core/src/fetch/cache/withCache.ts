import {
    createMemoryStore,
    createCachedFetch as withRequestCaching,
    createDedupedFetch as withRequestDeduping,
} from '@e1himself/cached-fetch';

import type { Fetch } from '../types';

import { createCacheKeyFn } from './createCacheKeyFn';
import { createSelfExpiringMemoryStore, type Options as StoreOptions } from './store';

type Awaitable<T> = T | Promise<T>;

export interface Options {
    /**
     * Output request cache HIT/MISS status to console.
     */
    debug?: boolean;
    /**
     * In-memory cache store TTL
     */
    ttl: StoreOptions['ttl'] | false;
    /**
     * Methods to cache
     */
    methods?: Request['method'][];
}

export function withCache(fetch: Fetch, { ttl, debug = false, methods }: Options): Fetch {
    const dedupeStore = createMemoryStore<Promise<Response>>();

    const getCacheKey = createCacheKeyFn(methods);

    const cache =
        ttl === false
            ? createMemoryStore<Awaitable<Response>>()
            : createSelfExpiringMemoryStore<Awaitable<Response>>({ ttl });

    const cachedFetch = withRequestDeduping(
        withRequestCaching(fetch, {
            cache,
            getCacheKey,
        }),
        {
            cache: dedupeStore,
            getCacheKey,
        },
    );

    if (debug) {
        return ((...args: Parameters<typeof cachedFetch>) => {
            const key = getCacheKey(...args);
            if (key && dedupeStore.has(key)) {
                // eslint-disable-next-line no-console
                console.info('Deduping request', args[0]);
            }
            if (key) {
                // eslint-disable-next-line no-console
                console.info(
                    cache.has(key) ? 'Cache HIT on request' : 'Cache MISS on request',
                    args[0],
                );
            }

            return cachedFetch(...args);
        }) as Fetch;
    }

    return cachedFetch as Fetch;
}
