/* eslint-disable no-console */
import type { ContentDelivery } from '@prezly/theme-kit-core';
import { createClient, type RedisClientOptions } from 'redis';

type Seconds = number;
type UnixTimestampInSeconds = number;

type Entry = {
    version: UnixTimestampInSeconds;
    value: any;
};

type Options = RedisClientOptions & {
    ttl?: Seconds;
    prefix?: string;
};

export function createRedisCache({
    ttl,
    prefix = 'content:',
    ...options
}: Options): ContentDelivery.Cache {
    function connect() {
        return createClient(options)
            .on('error', (error) => console.error(error))
            .connect();
    }

    const pendingConnection = connect();

    return {
        async get(key, latestVersion) {
            const client = await pendingConnection;
            const cached = await client.get(`${prefix}${key}`);
            if (!cached) {
                return undefined;
            }

            const entry = JSON.parse(cached) as Entry;
            if (entry.version < latestVersion) {
                // the entry is stale and cannot be used anymore
                return undefined;
            }

            if (ttl) {
                client.expire(`${prefix}${key}`, ttl); // bump TTL on entries access
            }

            return entry.value;
        },

        async set(key, value, version) {
            const client = await pendingConnection;
            const entry: Entry = { value, version };
            await client.set(`${prefix}${key}`, JSON.stringify(entry), { EX: ttl });
        },
    };
}
