import { ContentDelivery, Resolvable } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';

import { createRedisCache } from './redis';

const DEFAULT_REDIS_CACHE_TTL = 30 * 24 * 60 * 60; // 30 days

export interface Configuration {
    redis?: { url: string; prefix?: string; ttl?: number };
    /**
     * In-process cache in front of Redis. `true` uses the default bounds
     * (128 MiB of estimated payload, 20,000 entries); pass an object to change
     * them. The store is shared by every adapter in the runtime.
     */
    memory?: boolean | ContentDelivery.MemoryCacheOptions;
    latestVersion: Resolvable<number>;
    namespace?: string;
    /** Extra immutable identity for custom fetch implementations. Enables request sharing. */
    requestScope?: string;
    /** Retention in seconds for not-found results. See `ContentDelivery.DEFAULT_NEGATIVE_TTL`. */
    negativeTtl?: number;
    telemetry?: ContentDelivery.Telemetry;
}

export function configure(config: Configuration) {
    const storage = configureStorage(config);

    if (storage) {
        return {
            storage: config.namespace ? storage.namespace(config.namespace) : storage,
            latestVersion: Resolvable.resolve(config.latestVersion),
            negativeTtl: config.negativeTtl,
        };
    }

    return undefined;
}

function configureStorage(config: Configuration): ContentDelivery.Cache | undefined {
    const caches = [
        config.memory
            ? ContentDelivery.createSharedMemoryCache(
                  '',
                  typeof config.memory === 'object' ? config.memory : undefined,
              )
            : undefined,
        config.redis
            ? createRedisCache({
                  ttl: DEFAULT_REDIS_CACHE_TTL,
                  ...config.redis,
                  telemetry: config.telemetry,
              })
            : undefined,
    ].filter(isNotUndefined);

    if (caches.length === 0) {
        return undefined;
    }

    if (caches.length === 1) {
        return caches[0];
    }

    return ContentDelivery.createStackedCache(caches);
}
