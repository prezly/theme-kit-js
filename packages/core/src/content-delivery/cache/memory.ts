import type { Cache, Lookup, UnixTimestampInSeconds } from './type';
import { notify } from '../telemetry';

export interface MemoryCacheOptions {
    /** Upper bound on the estimated size of all stored values, in bytes. */
    maxBytes?: number;
    /** Upper bound on the number of stored entries. */
    maxRecords?: number;
}

export const DEFAULT_MAX_BYTES = 128 * 1024 * 1024;
export const DEFAULT_MAX_RECORDS = 20000;
/** @deprecated Use `DEFAULT_MAX_RECORDS`. */
export const RECORDS_LIMIT = DEFAULT_MAX_RECORDS;

type UnixTimestampInMilliseconds = number;

type Entry = {
    version: UnixTimestampInSeconds;
    value: any;
    /** Estimated size of the serialized value plus its key. */
    bytes: number;
    /** Absolute expiry for entries stored with an explicit `ttl`. */
    expires?: UnixTimestampInMilliseconds;
};

/**
 * One store per JavaScript runtime, shared by every namespace. `Map` keeps
 * insertion order, so re-inserting an entry on read makes the first entry the
 * least recently used one and eviction is a pop from the front: no sorting,
 * no probability.
 */
const CACHE = new Map<string, Entry>();
let totalBytes = 0;
let maxBytes = DEFAULT_MAX_BYTES;
let maxRecords = DEFAULT_MAX_RECORDS;

/** Sets the bounds of the shared store for the whole runtime. */
export function configureSharedMemoryCache(options: MemoryCacheOptions = {}): void {
    for (const [name, value] of Object.entries(options)) {
        if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
            throw new RangeError(`The memory cache ${name} bound must be a positive integer.`);
        }
    }
    maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
    maxRecords = options.maxRecords ?? DEFAULT_MAX_RECORDS;
    evict();
}

/** Empties the shared store. Intended for tests. */
export function clearSharedMemoryCache(): void {
    CACHE.clear();
    totalBytes = 0;
}

/** Current occupancy of the shared store. */
export function inspectSharedMemoryCache() {
    return { records: CACHE.size, bytes: totalBytes, maxBytes, maxRecords };
}

export function createSharedMemoryCache(prefix = '', options?: MemoryCacheOptions): Cache {
    if (options) configureSharedMemoryCache(options);

    function read(key: string): Entry | undefined {
        const fullKey = `${prefix}${key}`;
        const entry = CACHE.get(fullKey);
        if (!entry) return undefined;
        if ((entry.expires ?? Number.POSITIVE_INFINITY) <= Date.now()) {
            remove(fullKey, entry);
            return undefined;
        }
        // Most recently used entries live at the end of the map.
        CACHE.delete(fullKey);
        CACHE.set(fullKey, entry);
        return entry;
    }

    function validate(key: string, latestVersion: UnixTimestampInSeconds): Entry | undefined {
        const entry = read(key);
        if (!entry) return undefined;
        if (entry.version < latestVersion) {
            remove(`${prefix}${key}`, entry);
            return undefined;
        }
        return entry;
    }

    return {
        get(key, latestVersion, onSource) {
            const entry = validate(key, latestVersion);
            if (!entry) return undefined;
            if (onSource && entry.value !== undefined) notify(onSource, 'memory');
            return entry.value;
        },

        lookup<T>(key: string, latestVersion: UnixTimestampInSeconds): Lookup<T> | undefined {
            const entry = validate(key, latestVersion);
            if (!entry) return undefined;
            return {
                value: entry.value as T,
                version: entry.version,
                ttl:
                    entry.expires === undefined
                        ? undefined
                        : Math.max(1, Math.ceil((entry.expires - Date.now()) / 1000)),
                layer: 'memory',
            };
        },

        set(key, value, version, options) {
            const fullKey = `${prefix}${key}`;
            const previous = CACHE.get(fullKey);
            if (previous) remove(fullKey, previous);
            const entry: Entry = {
                value,
                version,
                bytes: estimateBytes(fullKey, value),
                expires: options?.ttl === undefined ? undefined : Date.now() + options.ttl * 1000,
            };
            CACHE.set(fullKey, entry);
            totalBytes += entry.bytes;
            evict();
        },

        namespace(namespace: string): Cache {
            return createSharedMemoryCache(`${prefix}${namespace}:`);
        },
    };
}

function remove(fullKey: string, entry: Entry): void {
    if (CACHE.delete(fullKey)) totalBytes -= entry.bytes;
}

/** Drops least recently used entries until both bounds hold. */
function evict(): void {
    while (CACHE.size > maxRecords || totalBytes > maxBytes) {
        const oldest = CACHE.keys().next();
        if (oldest.done) break;
        remove(oldest.value, CACHE.get(oldest.value)!);
    }
}

function estimateBytes(key: string, value: unknown): number {
    try {
        const serialized = JSON.stringify(value);
        return key.length + (serialized === undefined ? 0 : serialized.length);
    } catch {
        return key.length;
    }
}
