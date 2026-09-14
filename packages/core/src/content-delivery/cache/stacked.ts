import type { CacheLayer } from '../telemetry';
import type { Cache, UnixTimestampInSeconds } from './type';

export function createStackedCache(caches: Cache[]): Cache {
    return {
        async get<T>(
            key: string,
            latestVersion: UnixTimestampInSeconds,
            onSource?: (layer: CacheLayer) => void,
        ) {
            for (let i = 0; i < caches.length; i += 1) {
                const value = onSource
                    ? await caches[i].get<T>(key, latestVersion, onSource)
                    : await caches[i].get<T>(key, latestVersion);
                if (value !== undefined) {
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
