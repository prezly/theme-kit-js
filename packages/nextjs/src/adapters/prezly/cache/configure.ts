import { ContentDelivery } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';

import { createRedisCache } from './redis';

export interface Configuration {
    redis?: { url: string; prefix?: string; ttl?: number };
    memory?: boolean;
}

export function configure(config: Configuration): ContentDelivery.Cache | undefined {
    const caches = [
        config.memory ? ContentDelivery.createSharedMemoryCache() : undefined,
        config.redis ? createRedisCache(config.redis) : undefined,
    ].filter(isNotUndefined);

    if (caches.length === 0) {
        return undefined;
    }

    if (caches.length === 1) {
        return caches[0];
    }

    return ContentDelivery.createStackedCache(caches);
}
