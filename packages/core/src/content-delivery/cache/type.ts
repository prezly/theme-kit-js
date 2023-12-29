export type UnixTimestampInSeconds = number;

type Awaitable<T> = T | Promise<T>;

export interface Cache {
    get<T>(key: string, latestVersion: UnixTimestampInSeconds): Awaitable<T | undefined>;
    set<T>(key: string, value: T, version: UnixTimestampInSeconds): Awaitable<void>;
}
