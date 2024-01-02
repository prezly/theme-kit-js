/* eslint-disable @typescript-eslint/no-use-before-define */
import { ContentDelivery, Resolvable } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';

import { createRedisCache } from './redis';

const DEFAULT_REDIS_CACHE_TTL = 30 * 24 * 60 * 60; // 30 days

export interface Configuration {
    redis?: { url: string; prefix?: string; ttl?: number };
    memory?: boolean;
    latestVersion: Resolvable<number>;
    namespace?: string;
}

export function configure(config: Configuration) {
    const storage = configureStorage(config);

    if (storage) {
        return {
            storage: config.namespace ? storage.namespace(config.namespace) : storage,
            latestVersion: Resolvable.resolve(config.latestVersion),
        };
    }

    return undefined;
}

function configureStorage(config: Configuration): ContentDelivery.Cache | undefined {
    const caches = [
        config.memory ? ContentDelivery.createSharedMemoryCache() : undefined,
        config.redis
            ? createRedisCache({ ttl: DEFAULT_REDIS_CACHE_TTL, ...config.redis })
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
