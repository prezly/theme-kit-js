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

export function createRedisCache({ ttl, prefix = '', ...options }: Options): ContentDelivery.Cache {
    const connection = createClient(options)
        .on('error', (error) => console.error(error))
        .connect();

    function createCache(namespacePrefix = ''): ContentDelivery.Cache {
        return {
            async get(key, latestVersion) {
                const client = await connection;
                const cached = await client.get(`${namespacePrefix}${key}`);
                if (!cached) {
                    return undefined;
                }

                const entry = JSON.parse(cached) as Entry;
                if (entry.version < latestVersion) {
                    // the entry is stale and cannot be used anymore
                    return undefined;
                }

                if (ttl) {
                    client.expire(`${namespacePrefix}${key}`, ttl); // bump TTL on entries access
                }

                return entry.value;
            },

            async set(key, value, version) {
                const client = await connection;
                const entry: Entry = { value, version };
                await client.set(`${namespacePrefix}${key}`, JSON.stringify(entry), { EX: ttl });
            },

            namespace(namespace: string): ContentDelivery.Cache {
                return createCache(`${namespacePrefix}${namespace}:`);
            },
        };
    }

    return createCache(prefix);
}
