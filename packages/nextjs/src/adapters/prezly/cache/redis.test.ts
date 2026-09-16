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

it('preserves namespace and version, renews legacy entries by rewriting them, and observes renewal rejection', async () => {
    jest.useFakeTimers({ now: 1_700_000_000_000 });
    const { client, cache } = connection();
    // A legacy entry (no `written`) is renewed on first read even when the write fails.
    client.set.mockRejectedValueOnce(new Error('renewal failed'));
    expect(await cache.namespace('room').get('key', 2)).toBe('cached');
    expect(client.get).toHaveBeenLastCalledWith('test:room:key');
    expect(client.set).toHaveBeenCalledTimes(1);
    expect(client.set).toHaveBeenLastCalledWith(
        'test:room:key',
        JSON.stringify({ version: 2, value: 'cached', written: 1_700_000_000 }),
        { EX: 300 },
    );
    expect(client.expire).not.toHaveBeenCalled();
    expect(await cache.get('key', 3)).toBeUndefined();
    expect(client.set).toHaveBeenCalledTimes(1);
    await cache.set('key', 'updated', 3);
    expect(client.set).toHaveBeenLastCalledWith(
        'test:key',
        JSON.stringify({ value: 'updated', version: 3, written: 1_700_000_000 }),
        { EX: 300 },
    );
});

it('renews a regular entry only once it has consumed half of its lifetime', async () => {
    jest.useFakeTimers({ now: 1_700_000_000_000 });
    const { client, cache } = connection();
    const entry = { value: 'cached', version: 2, written: 1_700_000_000 };
    client.get.mockResolvedValue(JSON.stringify(entry));
    expect(await cache.get('key', 2)).toBe('cached');
    jest.setSystemTime(1_700_000_149_000); // 149s later, under half of the 300s ttl
    expect(await cache.get('key', 2)).toBe('cached');
    expect(client.set).not.toHaveBeenCalled();
    jest.setSystemTime(1_700_000_150_000); // exactly half of the lifetime
    expect(await cache.get('key', 2)).toBe('cached');
    expect(client.set).toHaveBeenCalledTimes(1);
    expect(client.set).toHaveBeenLastCalledWith(
        'test:key',
        JSON.stringify({ ...entry, written: 1_700_000_150 }),
        { EX: 300 },
    );
    expect(client.expire).not.toHaveBeenCalled();
});

it('exposes the entry version and retention through lookup', async () => {
    jest.useFakeTimers({ now: 1_700_000_000_000 });
    const { client, cache } = connection();
    client.get.mockResolvedValueOnce(
        JSON.stringify({ value: 'cached', version: 2, written: 1_700_000_000 }),
    );
    expect(await cache.lookup?.('key', 2)).toEqual({
        value: 'cached',
        version: 2,
        ttl: undefined,
        layer: 'redis',
    });
    client.get.mockResolvedValueOnce(JSON.stringify({ value: null, version: 4, ttl: 60 }));
    expect(await cache.namespace('room').lookup?.('missing', 4)).toEqual({
        value: null,
        version: 4,
        ttl: 60,
        layer: 'redis',
    });
    client.get.mockResolvedValueOnce(JSON.stringify({ value: 'old', version: 1 }));
    expect(await cache.lookup?.('key', 2)).toBeUndefined();
    expect(client.set).not.toHaveBeenCalled();
});

it('stores a short-lived entry with its own expiry and never renews it', async () => {
    const { client, cache } = connection();
    await cache.set('missing', null, 4, { ttl: 60 });
    expect(client.set).toHaveBeenLastCalledWith(
        'test:missing',
        JSON.stringify({ value: null, version: 4, ttl: 60 }),
        { EX: 60 },
    );
    client.get.mockResolvedValueOnce(JSON.stringify({ value: null, version: 4, ttl: 60 }));
    const onSource = jest.fn();
    expect(await cache.get('missing', 4, onSource)).toBeNull();
    expect(onSource).toHaveBeenCalledWith('redis');
    expect(client.expire).not.toHaveBeenCalled();
    expect(client.set).toHaveBeenCalledTimes(1); // the initial write only, never a renewal
    client.get.mockResolvedValueOnce(JSON.stringify({ value: null, version: 4, ttl: 60 }));
    expect(await cache.get('missing', 5)).toBeUndefined();
});

it('rounds a fractional ttl hint up to whole seconds for SET EX', async () => {
    const { client, cache } = connection();
    await cache.set('short', null, 1, { ttl: 0.5 });
    expect(client.set).toHaveBeenLastCalledWith(
        'test:short',
        JSON.stringify({ value: null, version: 1, ttl: 1 }),
        { EX: 1 },
    );
});

it.each([false, 0, ''])('returns a stored %p as a hit', async (value) => {
    const { client, cache } = connection();
    client.get.mockResolvedValueOnce(JSON.stringify({ value, version: 2 }));
    expect(await cache.get('key', 2)).toBe(value);
    expect(client.set).toHaveBeenCalledTimes(1); // legacy entry renewed by rewriting
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

it('does not fragment Redis connections by observer and distinguishes unavailable from commands', async () => {
    const { client, options } = connection(false);
    const events: any[] = [];
    const observe = (event: any) => {
        events.push(event);
    };
    const cache = createRedisCache({ ...options, telemetry: { observe, source: 'prezly' } });
    await cache.get('private-key', 1);
    await cache.set('private-key', 'private-value', 1);
    expect(events.filter((e) => e.type === 'redis_unavailable')).toHaveLength(2);
    expect(events.some((e) => e.type === 'redis_command')).toBe(false);
    expect(client.connect).toHaveBeenCalledTimes(1);
    client.isReady = true;
    const source = jest.fn();
    expect(await cache.namespace('private-room').get('private-key', 1, source)).toBe('cached');
    expect(source).toHaveBeenCalledWith('redis');
    await cache.set('private-key', 'value', 2);
    await new Promise<void>((resolve) => setImmediate(resolve));
    expect(
        events
            .filter((e) => e.type === 'redis_command')
            .map((e) => e.command)
            .sort(),
    ).toEqual(['expire', 'get', 'set']);
    expect(JSON.stringify(events)).not.toContain('private-');
    expect(createClient).toHaveBeenLastCalledWith(
        expect.not.objectContaining({ telemetry: expect.anything() }),
    );
});
