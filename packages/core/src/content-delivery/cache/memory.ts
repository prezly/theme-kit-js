import type { Cache, UnixTimestampInSeconds } from './type';
import { notify } from '../telemetry';

export const RECORDS_LIMIT = 10000;
const GC_PROBABILITY = 1 / 100;

const CACHE = new Map<string, Entry>();

type UnixTimestampInMilliseconds = number;

type Entry = {
    version: UnixTimestampInSeconds;
    value: any;
    accessed: UnixTimestampInMilliseconds;
    /** Absolute expiry for entries stored with an explicit `ttl`. */
    expires?: UnixTimestampInMilliseconds;
};

export function createSharedMemoryCache(prefix = ''): Cache {
    return {
        get(key, latestVersion, onSource) {
            const entry = CACHE.get(`${prefix}${key}`);
            if (!entry) {
                return undefined;
            }

            if (
                entry.version < latestVersion ||
                (entry.expires ?? Number.POSITIVE_INFINITY) <= Date.now()
            ) {
                CACHE.delete(`${prefix}${key}`);
                return undefined;
            }

            const { value, version, expires } = entry;

            CACHE.set(`${prefix}${key}`, { value, version, expires, accessed: Date.now() });

            if (onSource && value !== undefined) notify(onSource, 'memory');
            return value;
        },

        set(key, value, version, options) {
            const entry: Entry = {
                value,
                version,
                accessed: Date.now(),
                expires: options?.ttl === undefined ? undefined : Date.now() + options.ttl * 1000,
            };

            CACHE.set(`${prefix}${key}`, entry);

            if (CACHE.size > RECORDS_LIMIT && Math.random() < GC_PROBABILITY) {
                gc();
            }
        },

        namespace(namespace: string): Cache {
            return createSharedMemoryCache(`${prefix}${namespace}:`);
        },
    };
}

function gc() {
    Array.from(CACHE.entries())
        .sort(([, a], [, b]) => -cmp(a.accessed, b.accessed))
        .slice(RECORDS_LIMIT)
        .forEach(([key]) => {
            CACHE.delete(key);
        });
}

function cmp(a: UnixTimestampInMilliseconds, b: UnixTimestampInMilliseconds) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}
