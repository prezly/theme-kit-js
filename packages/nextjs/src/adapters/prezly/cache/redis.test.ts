import { createClient } from 'redis';

import { createRedisCache } from './redis';

jest.mock('redis', () => ({
    createClient: jest.fn(),
}));
let sequence = 0;
function connection(ready = true) {
    const client = {
        isReady: ready,
        on: jest.fn().mockReturnThis(),
        connect: jest.fn(() =>
            ready ? Promise.resolve(undefined) : new Promise<undefined>(() => {}),
        ),
        get: jest.fn(async () => JSON.stringify({ version: 2, value: 'cached' })),
        set: jest.fn(async () => 'OK'),
        expire: jest.fn(async () => true),
    };
    (createClient as jest.Mock).mockReturnValue(client);
    const options = { url: `redis://test-${sequence++}:6379`, ttl: 300, prefix: 'test:' };
    return { client, options, cache: createRedisCache(options) };
}

afterEach(() => jest.useRealTimers());

it('fails open while disconnected without waiting for connection establishment', async () => {
    const { client, cache, options } = connection(false);
    expect(await cache.get('key', 1)).toBeUndefined();
    await cache.set('key', 'value', 1);
    expect(client.get).not.toHaveBeenCalled();
    expect(client.set).not.toHaveBeenCalled();
    createRedisCache(options);
    expect(client.connect).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenLastCalledWith(
        expect.objectContaining({
            disableOfflineQueue: true,
            commandsQueueMaxLength: 128,
            socket: expect.objectContaining({ connectTimeout: 1000 }),
        }),
    );
    client.isReady = true;
    expect(await cache.get('key', 1)).toBe('cached');
});

it('preserves namespace, version and sliding expiry and observes expiry rejection', async () => {
    const { client, cache } = connection();
    client.expire.mockRejectedValueOnce(new Error('expiry failed'));
    expect(await cache.namespace('room').get('key', 2)).toBe('cached');
    expect(client.get).toHaveBeenLastCalledWith('test:room:key');
    expect(await cache.get('key', 3)).toBeUndefined();
    expect(client.expire).toHaveBeenCalledTimes(1);
    await cache.set('key', 'updated', 3);
    expect(client.set).toHaveBeenLastCalledWith(
        'test:key',
        JSON.stringify({ value: 'updated', version: 3 }),
        { EX: 300 },
    );
});

it.each(['get', 'set'] as const)(
    'times out stalled %s commands without unsafe cancellation and recovers',
    async (method) => {
        jest.useFakeTimers();
        const { client, cache } = connection();
        let rejectOperation!: (error: Error) => void;
        client[method].mockImplementationOnce(
            (() =>
                new Promise((_, reject) => {
                    rejectOperation = reject;
                })) as any,
        );
        const pending = method === 'get' ? cache.get('key', 1) : cache.set('key', 'value', 1);
        const failed = expect(pending).rejects.toThrow('timed out');
        await jest.advanceTimersByTimeAsync(1000);
        await failed;
        rejectOperation(new Error('late failure'));
        expect(await cache.get('key', 1)).toBe('cached');
        await jest.advanceTimersByTimeAsync(0);
        expect(jest.getTimerCount()).toBe(0);
    },
);
