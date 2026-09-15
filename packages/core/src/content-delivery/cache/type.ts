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
    set<T>(
        key: string,
        value: T,
        version: UnixTimestampInSeconds,
        options?: SetOptions,
    ): Awaitable<void>;
    namespace(namespace: string): Cache;
}
import type { CacheLayer } from '../telemetry';
