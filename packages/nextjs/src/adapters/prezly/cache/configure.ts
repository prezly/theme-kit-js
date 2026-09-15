import { ContentDelivery, Resolvable } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';

import { createRedisCache } from './redis';

const DEFAULT_REDIS_CACHE_TTL = 30 * 24 * 60 * 60; // 30 days

export interface Configuration {
    redis?: { url: string; prefix?: string; ttl?: number };
    memory?: boolean;
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
        config.memory ? ContentDelivery.createSharedMemoryCache() : undefined,
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
