import { type CacheLayer, notify } from '../telemetry';
import type { Cache, UnixTimestampInSeconds } from './type';

export function createStackedCache(caches: Cache[]): Cache {
    return {
        async get<T>(
            key: string,
            latestVersion: UnixTimestampInSeconds,
            onSource?: (layer: CacheLayer) => void,
        ) {
            for (let i = 0; i < caches.length; i += 1) {
                let source: CacheLayer = 'custom';
                const value = onSource
                    ? await caches[i].get<T>(key, latestVersion, (layer) => {
                          source = layer;
                      })
                    : await caches[i].get<T>(key, latestVersion);
                if (value !== undefined) {
                    if (onSource) notify(onSource, source);
                    return value;
                }
            }
            return undefined;
        },

        async set(key, value, version) {
            await Promise.all(caches.map((cache) => cache.set(key, value, version)));
        },

        namespace(namespace: string): Cache {
            return createStackedCache(caches.map((cache) => cache.namespace(namespace)));
        },
    };
}
