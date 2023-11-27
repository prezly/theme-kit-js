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
            const [url, init] = args;

            const key = getCacheKey(...args);

            const { method = 'get', body = undefined } = init ?? {};
            const endpoint =
                method.toLowerCase() === 'get' ? `${method} ${url}` : `${method} ${url}\n${body}`;

            if (!key) {
                // eslint-disable-next-line no-console
                console.info(`Uncachable request ${endpoint}`);
            }

            if (key && dedupeStore.has(key)) {
                // eslint-disable-next-line no-console
                console.info(`Deduping request ${endpoint}`);

                return cachedFetch(...args).then((data) => {
                    console.info(
                        cache.has(key)
                            ? `Cache HIT on deduped request ${endpoint}`
                            : `Cache MISS on deduped request ${endpoint}`,
                    );
                    return data;
                });
            }
            if (key) {
                // eslint-disable-next-line no-console
                console.info(
                    cache.has(key)
                        ? `Cache HIT on request ${endpoint}`
                        : `Cache MISS on request ${endpoint}`,
                );
            }

            return cachedFetch(...args).then((data) => {
                if (key) {
                    console.info(
                        cache.has(key)
                            ? `Cached request ${endpoint}`
                            : `DID NOT cache request ${endpoint}`,
                    );
                }
                return data;
            });
        }) as Fetch;
    }

    return cachedFetch as Fetch;
}
