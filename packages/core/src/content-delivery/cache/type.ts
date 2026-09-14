export type UnixTimestampInSeconds = number;

type Awaitable<T> = T | Promise<T>;

export interface Cache {
    get<T>(
        key: string,
        latestVersion: UnixTimestampInSeconds,
        onSource?: (layer: CacheLayer) => void,
    ): Awaitable<T | undefined>;
    set<T>(key: string, value: T, version: UnixTimestampInSeconds): Awaitable<void>;
    namespace(namespace: string): Cache;
}
import type { CacheLayer } from '../telemetry';
