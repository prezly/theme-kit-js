import type { ContentDelivery } from '@prezly/theme-kit-core';
import stableStringify from 'json-stable-stringify';
import { createClient, type RedisClientOptions } from 'redis';

type Seconds = number;
type UnixTimestampInSeconds = number;
type Entry = { version: UnixTimestampInSeconds; value: any };
type Options = RedisClientOptions & { ttl?: Seconds; prefix?: string };

const COMMAND_TIMEOUT = 1000;
const CONNECTIONS = new Map<string, ReturnType<typeof createClient>>();

async function command<T>(invoke: () => Promise<T>): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
        // node-redis 4 can corrupt its command queue when aborting a command
        // already sent to the socket. Leave that operation tracked by the client;
        // commandsQueueMaxLength bounds all outstanding replies, including these.
        return await Promise.race([
            Promise.resolve().then(invoke),
            new Promise<never>((_, reject) => {
                timer = setTimeout(
                    () => reject(new Error('Content cache command timed out.')),
                    COMMAND_TIMEOUT,
                );
            }),
        ]);
    } finally {
        clearTimeout(timer);
    }
}

export function createRedisCache({ ttl, prefix = '', ...options }: Options): ContentDelivery.Cache {
    const connectionKey = stableStringify(options) as string;
    let client = CONNECTIONS.get(connectionKey);
    if (!client) {
        client = createClient({
            ...options,
            // Do not accumulate application commands during a disconnected period.
            disableOfflineQueue: true,
            commandsQueueMaxLength: 128,
            socket: { ...options.socket, connectTimeout: 1000 },
        }).on('error', (error) => console.error(error));
        CONNECTIONS.set(connectionKey, client);
        // Reconnection belongs to this one shared client. Requests never wait on
        // its potentially long-lived connection promise when Redis is unavailable.
        void client.connect().catch(() => undefined);
    }
    const connection = client;

    function createCache(namespacePrefix = ''): ContentDelivery.Cache {
        return {
            async get(key, latestVersion) {
                if (!connection.isReady) return undefined;
                const cached = await command(() => connection.get(`${namespacePrefix}${key}`));
                if (!cached) return undefined;
                const entry = JSON.parse(cached) as Entry;
                if (entry.version < latestVersion) return undefined;
                if (ttl) {
                    void command(() => connection.expire(`${namespacePrefix}${key}`, ttl)).catch(
                        () => undefined,
                    );
                }
                return entry.value;
            },

            async set(key, value, version) {
                if (!connection.isReady) return;
                const entry: Entry = { value, version };
                await command(() =>
                    connection.set(`${namespacePrefix}${key}`, JSON.stringify(entry), { EX: ttl }),
                );
            },

            namespace(namespace: string): ContentDelivery.Cache {
                return createCache(`${namespacePrefix}${namespace}:`);
            },
        };
    }
    return createCache(prefix);
}
