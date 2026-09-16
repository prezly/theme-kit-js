import { type CacheLayer, notify } from '../telemetry';
import type { Cache, Lookup, UnixTimestampInSeconds } from './type';

/**
 * Reads layers in order and refills every earlier layer with a hit found in a
 * later one, carrying the entry's own version and retention, so the next
 * request on this runtime is served from memory instead of Redis. Only layers
 * that expose `lookup` are refill sources; a hit from a `get`-only layer is
 * returned as before and not copied.
 */
export function createStackedCache(caches: Cache[]): Cache {
    async function find<T>(
        key: string,
        latestVersion: UnixTimestampInSeconds,
        onSource?: (layer: CacheLayer) => void,
    ): Promise<{ index: number; found: Lookup<T> | undefined; value: T | undefined }> {
        for (let i = 0; i < caches.length; i += 1) {
            const layer = caches[i];
            if (layer.lookup) {
                const found = await layer.lookup<T>(key, latestVersion);
                if (found !== undefined) {
                    if (onSource) notify(onSource, found.layer);
                    return { index: i, found, value: found.value };
                }
                continue;
            }
            let source: CacheLayer = 'custom';
            const value = onSource
                ? await layer.get<T>(key, latestVersion, (reported) => {
                      source = reported;
                  })
                : await layer.get<T>(key, latestVersion);
            if (value !== undefined) {
                if (onSource) notify(onSource, source);
                return { index: i, found: undefined, value };
            }
        }
        return { index: -1, found: undefined, value: undefined };
    }

    function refill<T>(key: string, index: number, found: Lookup<T>): void {
        for (let j = 0; j < index; j += 1) {
            const layer = caches[j];
            // Best effort: the response never waits on a refill, and a failing
            // layer must not turn a hit into an error.
            void Promise.resolve()
                .then(() =>
                    layer.set(
                        key,
                        found.value,
                        found.version,
                        found.ttl === undefined ? undefined : { ttl: found.ttl },
                    ),
                )
                .catch(() => undefined);
        }
    }

    return {
        async get<T>(
            key: string,
            latestVersion: UnixTimestampInSeconds,
            onSource?: (layer: CacheLayer) => void,
        ) {
            const { index, found, value } = await find<T>(key, latestVersion, onSource);
            if (found && index > 0) refill(key, index, found);
            return value;
        },

        async lookup<T>(key: string, latestVersion: UnixTimestampInSeconds) {
            const { index, found } = await find<T>(key, latestVersion);
            if (found && index > 0) refill(key, index, found);
            return found;
        },

        async set(key, value, version, options) {
            await Promise.all(caches.map((cache) => cache.set(key, value, version, options)));
        },

        namespace(namespace: string): Cache {
            return createStackedCache(caches.map((cache) => cache.namespace(namespace)));
        },
    };
}
