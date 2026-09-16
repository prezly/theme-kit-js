export type UnixTimestampInSeconds = number;

type Awaitable<T> = T | Promise<T>;

export type Seconds = number;

export interface SetOptions {
    /**
     * Retention for this entry in seconds. When omitted, the layer applies its
     * own default. A layer must not extend an entry beyond its own `ttl` on read.
     */
    ttl?: Seconds;
}

/**
 * A validated entry with the metadata another layer needs to store it as is.
 */
export interface Lookup<T> {
    value: T;
    version: UnixTimestampInSeconds;
    /** Remaining or original short retention, when the entry has one. */
    ttl?: Seconds;
    layer: CacheLayer;
}

export interface Cache {
    /**
     * Resolves `undefined` only when no entry exists (or it is stale).
     * A stored `null`, `false` or `0` is a valid hit and must be returned as is.
     */
    get<T>(
        key: string,
        latestVersion: UnixTimestampInSeconds,
        onSource?: (layer: CacheLayer) => void,
    ): Awaitable<T | undefined>;
    /**
     * Like `get`, but returns the entry's version and retention as well, so a
     * stacked cache can refill an earlier layer without guessing. Layers that
     * do not implement it are read with `get` and never used as a refill source.
     */
    lookup?<T>(
        key: string,
        latestVersion: UnixTimestampInSeconds,
    ): Awaitable<Lookup<T> | undefined>;
    set<T>(
        key: string,
        value: T,
        version: UnixTimestampInSeconds,
        options?: SetOptions,
    ): Awaitable<void>;
    namespace(namespace: string): Cache;
}
import type { CacheLayer } from '../telemetry';
