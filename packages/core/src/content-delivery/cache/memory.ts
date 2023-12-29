/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Cache, UnixTimestampInSeconds } from './type';

const RECORDS_LIMIT = 10000;
const GC_PROBABILITY = 0.01;

const CACHE = new Map<string, Entry>();

type UnixTimestampInMilliseconds = number;

type Entry = {
    version: UnixTimestampInSeconds;
    value: any;
    accessed: UnixTimestampInMilliseconds;
};

export function createSharedMemoryCache(): Cache {
    function gc() {
        Array.from(CACHE.entries())
            .sort(([, a], [, b]) => cmp(a.accessed, b.accessed))
            .slice(RECORDS_LIMIT)
            .forEach(([key]) => {
                CACHE.delete(key);
            });
    }

    return {
        get(key, latestVersion) {
            const entry = CACHE.get(key);
            if (!entry) {
                return undefined;
            }

            if (entry.version < latestVersion) {
                CACHE.delete(key);
                return undefined;
            }

            const { value, version } = entry;

            CACHE.set(key, { value, version, accessed: new Date().getTime() });

            return value;
        },

        set(key, value, version) {
            const entry = { value, version, accessed: new Date().getTime() };

            CACHE.set(key, entry);

            if (CACHE.size > RECORDS_LIMIT && Math.random() < GC_PROBABILITY) {
                gc();
            }
        },
    };
}

function cmp(a: UnixTimestampInMilliseconds, b: UnixTimestampInMilliseconds) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}
