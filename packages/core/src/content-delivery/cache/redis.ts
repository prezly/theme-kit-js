/* eslint-disable no-console */
import { createClient, type RedisClientOptions } from 'redis';

import type { Cache, UnixTimestampInSeconds } from './type';

type Seconds = number;

type Entry = {
    version: UnixTimestampInSeconds;
    value: any;
};

type Options = RedisClientOptions & {
    ttl?: Seconds;
};

export async function createRedisCache({ ttl, ...options }: Options): Promise<Cache> {
    const client = await createClient(options)
        .on('error', (error) => console.error(error))
        .connect();

    return {
        async get(key, latestVersion) {
            const cached = await client.get(key);
            if (!cached) {
                return undefined;
            }

            const entry = JSON.parse(cached) as Entry;
            if (entry.version < latestVersion) {
                // the entry is stale and cannot be used anymore
                return undefined;
            }

            if (ttl) {
                client.expire(key, ttl); // bump TTL on entries access
            }

            return entry.value;
        },

        async set(key, value, version) {
            const entry: Entry = { value, version };
            await client.set(key, JSON.stringify(entry), { EX: ttl });
        },
    };
}
