import { ContentDelivery } from '@prezly/theme-kit-core';
import stableStringify from 'json-stable-stringify';
import { createClient, type RedisClientOptions } from 'redis';

type Seconds = number;
type UnixTimestampInSeconds = number;
type Entry = {
    version: UnixTimestampInSeconds;
    value: any;
    /** Present for entries stored with their own short retention (e.g. not-found results). */
    ttl?: Seconds;
    /**
     * When the entry was last written: renewal timing for regular entries and
     * remaining-retention reporting for short-lived ones. Absent on entries
     * from older releases.
     */
    written?: UnixTimestampInSeconds;
};
type Options = RedisClientOptions & {
    ttl?: Seconds;
    prefix?: string;
    telemetry?: ContentDelivery.Telemetry;
};

const COMMAND_TIMEOUT = 1000;
/**
 * Renews an entry only if it is still the one that was read, so a renewal
 * that lands after a newer write (another pod refreshing the key from origin)
 * never puts the older payload back. EXPIRE had no such race; a plain SET has.
 */
const RENEW_IF_UNCHANGED = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
end
return nil
`;
const now = (): UnixTimestampInSeconds => Math.floor(Date.now() / 1000);
const CONNECTIONS = new Map<string, ReturnType<typeof createClient>>();

async function command<T>(
    invoke: () => Promise<T>,
    telemetry?: ContentDelivery.Telemetry,
    operation: 'get' | 'set' | 'expire' = 'get',
): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = telemetry ? ContentDelivery.telemetryNow() : 0;
    let outcome: 'success' | 'error' = 'error';
    try {
        // node-redis 4 can corrupt its command queue when aborting a command
        // already sent to the socket. Leave that operation tracked by the client;
        // commandsQueueMaxLength bounds all outstanding replies, including these.
        const value = await Promise.race([
            Promise.resolve().then(invoke),
            new Promise<never>((_, reject) => {
                timer = setTimeout(
                    () => reject(new Error('Content cache command timed out.')),
                    COMMAND_TIMEOUT,
                );
            }),
        ]);
        outcome = 'success';
        return value;
    } finally {
        clearTimeout(timer);
        ContentDelivery.emit(telemetry, {
            type: 'redis_command',
            command: operation,
            outcome,
            seconds: telemetry ? ContentDelivery.elapsedSeconds(start) : 0,
        });
    }
}

export function createRedisCache({
    ttl,
    prefix = '',
    telemetry,
    ...options
}: Options): ContentDelivery.Cache {
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
        async function read(
            key: string,
            latestVersion: UnixTimestampInSeconds,
        ): Promise<Entry | undefined> {
            if (!connection.isReady) {
                ContentDelivery.emit(telemetry, { type: 'redis_unavailable', command: 'get' });
                return undefined;
            }
            const fullKey = `${namespacePrefix}${key}`;
            const cached = await command(() => connection.get(fullKey), telemetry, 'get');
            if (!cached) return undefined;
            const entry = JSON.parse(cached) as Entry;
            if (entry.version < latestVersion) return undefined;
            // Sliding expiry applies to regular content only: an entry with its
            // own short retention must not be renewed to the default lifetime.
            // Renewal used to be an EXPIRE on every read, doubling the command
            // rate. Now an entry is rewritten with a fresh timestamp only once it
            // has consumed half of its lifetime, so a hot key costs one write per
            // half-life instead of one per read. Entries from older releases
            // carry no timestamp and are renewed on their first read. A timestamp
            // in the future (clock skew) is treated as due as well.
            if (ttl && entry.ttl === undefined) {
                const time = now();
                if (
                    entry.written === undefined ||
                    entry.written > time ||
                    time - entry.written >= ttl / 2
                ) {
                    const renewed: Entry = { ...entry, written: time };
                    void command(
                        () =>
                            connection.eval(RENEW_IF_UNCHANGED, {
                                keys: [fullKey],
                                arguments: [cached, JSON.stringify(renewed), String(ttl)],
                            }),
                        telemetry,
                        'expire',
                    ).catch(() => undefined);
                }
            }
            return entry;
        }

        return {
            async get(key, latestVersion, onSource) {
                const entry = await read(key, latestVersion);
                if (!entry) return undefined;
                if (onSource) ContentDelivery.notify(onSource, 'redis');
                return entry.value;
            },

            async lookup(key, latestVersion) {
                const entry = await read(key, latestVersion);
                if (!entry) return undefined;
                // Report what is left of a short retention, so a refilled copy
                // does not outlive this one. Legacy entries have no timestamp
                // and report their original retention.
                const age = entry.written === undefined ? 0 : Math.max(0, now() - entry.written);
                return {
                    value: entry.value,
                    version: entry.version,
                    ttl: entry.ttl === undefined ? undefined : Math.max(1, entry.ttl - age),
                    layer: 'redis' as const,
                };
            },

            async set(key, value, version, options) {
                if (!connection.isReady) {
                    ContentDelivery.emit(telemetry, { type: 'redis_unavailable', command: 'set' });
                    return;
                }
                // SET EX takes whole seconds; round a fractional hint up, never down.
                const entry: Entry =
                    options?.ttl === undefined
                        ? { value, version, written: now() }
                        : {
                              value,
                              version,
                              ttl: Math.max(1, Math.ceil(options.ttl)),
                              written: now(),
                          };
                await command(
                    () =>
                        connection.set(`${namespacePrefix}${key}`, JSON.stringify(entry), {
                            EX: entry.ttl ?? ttl,
                        }),
                    telemetry,
                    'set',
                );
            },

            namespace(namespace: string): ContentDelivery.Cache {
                return createCache(`${namespacePrefix}${namespace}:`);
            },
        };
    }
    return createCache(prefix);
}
