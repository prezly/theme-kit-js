import type { PrezlyClient } from '@prezly/sdk';
import { ApiError, Story } from '@prezly/sdk';

import type { Cache, SetOptions } from './cache';
import { createClient, DEFAULT_NEGATIVE_TTL } from './ContentDelivery';

function memory() {
    const entries = new Map<string, { version: number; value: any; ttl?: number }>();
    const get = jest.fn((key: string, version: number) => {
        const entry = entries.get(key);
        return entry && entry.version >= version ? entry.value : undefined;
    });
    const set = jest.fn(async (key: string, value: any, version: number, options?: SetOptions) => {
        entries.set(key, { value, version, ttl: options?.ttl });
    });
    function storage(prefix = ''): Cache {
        return {
            get: (key, version) => get(prefix + key, version),
            set: (key, value, version, options) => set(prefix + key, value, version, options),
            namespace: (name) => storage(`${prefix}${name}:`),
        };
    }
    return { entries, get, set, storage: storage() };
}
function api(value = 'data') {
    const get = jest.fn(async () => ({ name: value, stories_number: 600 }));
    const search = jest.fn(async ({ offset }: { offset: number }) => ({ stories: [offset] }));
    return {
        get,
        search,
        client: { newsrooms: { get }, stories: { search } } as unknown as PrezlyClient,
    };
}
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
let sequence = 0;
const identity = () => `unit-scope-${sequence++}`;

describe('ContentDelivery request sharing', () => {
    it('reduces 20 independent clients on one cold key to one origin call', async () => {
        const storage = memory();
        const sdk = api();
        const cache = { storage: storage.storage, latestVersion: 1, scope: identity() };
        const clients = Array.from({ length: 20 }, () =>
            createClient(sdk.client, 'room', undefined, { cache }),
        );
        const values = await Promise.all(clients.map((client) => client.newsroom()));
        expect(sdk.get).toHaveBeenCalledTimes(1);
        expect(values.every((value) => value.name === 'data')).toBe(true);
        await flush();
        await createClient(sdk.client, 'room', undefined, { cache }).newsroom();
        expect(sdk.get).toHaveBeenCalledTimes(1);
    });

    it('isolates warm data by source/authorization scope without accumulating scope namespaces', async () => {
        const storage = memory();
        const a = api('A');
        const b = api('B');
        const cache = { storage: storage.storage, latestVersion: 1 };
        const scopeA = identity();
        const scopeB = identity();
        const first = createClient(a.client, 'room', undefined, {
            cache: { ...cache, scope: scopeA },
        });
        const second = createClient(b.client, 'room', undefined, {
            cache: { ...cache, scope: scopeB },
        });
        expect((await first.newsroom()).name).toBe('A');
        await flush();
        expect((await second.newsroom()).name).toBe('B');
        await flush();
        expect((await first.newsroom()).name).toBe('A');
        await flush();
        expect(a.get).toHaveBeenCalledTimes(2);
        expect(b.get).toHaveBeenCalledTimes(1);
        expect(storage.entries.size).toBe(1);
    });

    it('isolates newsroom, theme, format and version and refreshes after invalidation', async () => {
        const storage = memory();
        const sdk = api();
        const cache = { storage: storage.storage, scope: identity(), latestVersion: 1 };
        const values = [
            createClient(sdk.client, 'room', undefined, { cache }),
            createClient(sdk.client, 'another-room', undefined, { cache }),
            createClient(sdk.client, 'room', 'theme', { cache }),
            createClient(sdk.client, 'room', undefined, {
                cache,
                formats: [Story.FormatVersion.SLATEJS_V6],
            }),
            createClient(sdk.client, 'room', undefined, { cache: { ...cache, latestVersion: 2 } }),
        ];
        await Promise.all(values.map((client) => client.newsroom()));
        expect(sdk.get).toHaveBeenCalledTimes(5);
        await flush();
        sdk.get.mockResolvedValue({ name: 'new version', stories_number: 600 });
        expect(
            (
                await createClient(sdk.client, 'room', undefined, {
                    cache: { ...cache, latestVersion: 3 },
                }).newsroom()
            ).name,
        ).toBe('new version');
        expect(sdk.get).toHaveBeenCalledTimes(6);
    });

    it('isolates method arguments and shares aggregate calls without self-deadlocking', async () => {
        const storage = memory();
        const sdk = api();
        const cache = { storage: storage.storage, scope: identity(), latestVersion: 1 };
        const clients = Array.from({ length: 20 }, () =>
            createClient(sdk.client, 'room', undefined, { cache }),
        );
        const results = await Promise.all(clients.map((client) => client.allStories()));
        expect(results).toEqual(Array.from({ length: 20 }, () => [0, 200, 400]));
        expect(sdk.get).toHaveBeenCalledTimes(1);
        expect(sdk.search).toHaveBeenCalledTimes(3);
    });

    it('recovers from origin rejection and from a later cache invalidation', async () => {
        const storage = memory();
        const sdk = api();
        const cache = { storage: storage.storage, scope: identity(), latestVersion: 1 };
        const client = () => createClient(sdk.client, 'room', undefined, { cache });
        sdk.get.mockRejectedValueOnce(new Error('origin failed'));
        const failures = await Promise.allSettled(
            Array.from({ length: 20 }, () => client().newsroom()),
        );
        expect(failures.every((value) => value.status === 'rejected')).toBe(true);
        expect(sdk.get).toHaveBeenCalledTimes(1);
        expect((await client().newsroom()).name).toBe('data');
        await flush();
        storage.entries.clear();
        await client().newsroom();
        expect(sdk.get).toHaveBeenCalledTimes(3);
    });

    it('shares bounded fallback when cache reads/writes reject or throw', async () => {
        const storage = memory();
        const sdk = api();
        storage.get.mockImplementation(() => {
            throw new Error('cache read failed');
        });
        storage.set.mockRejectedValue(new Error('cache write failed'));
        const cache = { storage: storage.storage, scope: identity(), latestVersion: 1 };
        const client = () => createClient(sdk.client, 'room', undefined, { cache });
        await Promise.all(Array.from({ length: 20 }, () => client().newsroom()));
        expect(sdk.get).toHaveBeenCalledTimes(1);
        await flush();
        await client().newsroom();
        expect(sdk.get).toHaveBeenCalledTimes(2);
    });

    it('does not share anonymous SDK identities across separate clients', async () => {
        const storage = memory();
        const a = api('A');
        const b = api('B');
        const cache = { storage: storage.storage, latestVersion: 1 };
        const result = await Promise.all([
            createClient(a.client, 'room', undefined, { cache }).newsroom(),
            createClient(b.client, 'room', undefined, { cache }).newsroom(),
        ]);
        expect(result.map((room) => room.name)).toEqual(['A', 'B']);
    });

    it('rechecks cache and origin across clients after a custom write stalls', async () => {
        jest.useFakeTimers();
        try {
            const storage = memory();
            storage.set.mockImplementation(() => new Promise<void>(() => {}));
            const sdk = api('original');
            const cache = { storage: storage.storage, scope: identity(), latestVersion: 1 };
            const client = () => createClient(sdk.client, 'room', undefined, { cache });
            await Promise.all(Array.from({ length: 20 }, () => client().newsroom()));
            expect(storage.get).toHaveBeenCalledTimes(1);
            expect(sdk.get).toHaveBeenCalledTimes(1);
            sdk.get.mockResolvedValue({ name: 'fresh', stories_number: 600 });
            await jest.advanceTimersByTimeAsync(1000);
            const retried = await Promise.all(
                Array.from({ length: 20 }, () => client().newsroom()),
            );
            expect(retried.every((room) => room.name === 'fresh')).toBe(true);
            expect(storage.get).toHaveBeenCalledTimes(2);
            expect(sdk.get).toHaveBeenCalledTimes(2);
        } finally {
            await jest.advanceTimersByTimeAsync(1000);
            jest.useRealTimers();
        }
    });
});

function apiError(status: number) {
    return new ApiError({
        payload: { code: status, message: 'x' } as any,
        status,
        statusText: 'x',
        headers: {},
    });
}
function storyApi(outcomes: (number | 'story')[]) {
    const queue = [...outcomes];
    const getBySlug = jest.fn(async (slug: string) => {
        const outcome = queue.shift() ?? 'story';
        if (outcome === 'story') return { slug, uuid: `uuid-${slug}` };
        throw apiError(outcome);
    });
    return { getBySlug, client: { stories: { getBySlug } } as unknown as PrezlyClient };
}

describe('ContentDelivery negative caching', () => {
    it('reuses a cached null story across clients and stores it with the negative TTL', async () => {
        const storage = memory();
        const sdk = storyApi([404]);
        const cache = { storage: storage.storage, latestVersion: 1, scope: identity() };
        const first = createClient(sdk.client, 'room', undefined, { cache });
        expect(await first.story({ slug: 'missing' })).toBeNull();
        await flush();
        expect(
            await createClient(sdk.client, 'room', undefined, { cache }).story({ slug: 'missing' }),
        ).toBeNull();
        expect(sdk.getBySlug).toHaveBeenCalledTimes(1);
        const [entry] = storage.entries.values();
        expect(entry.ttl).toBe(DEFAULT_NEGATIVE_TTL);
        expect(entry.value).toEqual({ scope: cache.scope, value: null });
    });

    it.each([403, 410])(
        'keeps a %s result only for the configured negative TTL',
        async (status) => {
            const storage = memory();
            const sdk = storyApi([status]);
            const cache = {
                storage: storage.storage,
                latestVersion: 1,
                scope: identity(),
                negativeTtl: 5,
            };
            expect(
                await createClient(sdk.client, 'room', undefined, { cache }).story({ slug: 's' }),
            ).toBeNull();
            await flush();
            expect([...storage.entries.values()][0].ttl).toBe(5);
        },
    );

    it('stores found stories without a short TTL', async () => {
        const storage = memory();
        const sdk = storyApi(['story']);
        const cache = { storage: storage.storage, latestVersion: 1, scope: identity() };
        expect(
            await createClient(sdk.client, 'room', undefined, { cache }).story({ slug: 's' }),
        ).toMatchObject({ slug: 's' });
        await flush();
        expect([...storage.entries.values()][0].ttl).toBeUndefined();
    });

    it('serves published content after a cache version change', async () => {
        const storage = memory();
        const sdk = storyApi([404, 'story']);
        const cache = { storage: storage.storage, latestVersion: 1, scope: identity() };
        expect(
            await createClient(sdk.client, 'room', undefined, { cache }).story({ slug: 's' }),
        ).toBeNull();
        await flush();
        expect(
            await createClient(sdk.client, 'room', undefined, {
                cache: { ...cache, latestVersion: 2 },
            }).story({ slug: 's' }),
        ).toMatchObject({ slug: 's' });
        expect(sdk.getBySlug).toHaveBeenCalledTimes(2);
    });

    it.each([401, 429, 500, 503])(
        'does not store a %s failure and retries the next lookup',
        async (status) => {
            const storage = memory();
            const sdk = storyApi([status, 'story']);
            const cache = { storage: storage.storage, latestVersion: 1, scope: identity() };
            const client = createClient(sdk.client, 'room', undefined, { cache });
            await expect(client.story({ slug: 's' })).rejects.toMatchObject({ status });
            await flush();
            expect(storage.set).not.toHaveBeenCalled();
            expect(await client.story({ slug: 's' })).toMatchObject({ slug: 's' });
        },
    );

    it('does not store a transport failure', async () => {
        const storage = memory();
        const getBySlug = jest.fn(async () => {
            throw new TypeError('fetch failed');
        });
        const client = { stories: { getBySlug } } as unknown as PrezlyClient;
        const cache = { storage: storage.storage, latestVersion: 1, scope: identity() };
        await expect(
            createClient(client, 'room', undefined, { cache }).story({ slug: 's' }),
        ).rejects.toThrow('fetch failed');
        await flush();
        expect(storage.set).not.toHaveBeenCalled();
    });

    it('isolates not-found results per newsroom', async () => {
        const storage = memory();
        const sdk = storyApi([404, 'story']);
        const cache = { storage: storage.storage, latestVersion: 1, scope: identity() };
        expect(
            await createClient(sdk.client, 'room-a', undefined, { cache }).story({ slug: 's' }),
        ).toBeNull();
        await flush();
        expect(
            await createClient(sdk.client, 'room-b', undefined, { cache }).story({ slug: 's' }),
        ).toMatchObject({ slug: 's' });
        expect(sdk.getBySlug).toHaveBeenCalledTimes(2);
        expect(storage.entries.size).toBe(2);
    });

    it.each([false, 0, ''])('treats a cached %p as a hit', async (value) => {
        const storage = memory();
        const get = jest.fn(async () => value);
        const client = { newsrooms: { get } } as unknown as PrezlyClient;
        const cache = { storage: storage.storage, latestVersion: 1, scope: identity() };
        expect(await createClient(client, 'room', undefined, { cache }).newsroom()).toBe(value);
        await flush();
        expect(await createClient(client, 'room', undefined, { cache }).newsroom()).toBe(value);
        expect(get).toHaveBeenCalledTimes(1);
        expect([...storage.entries.values()][0].ttl).toBeUndefined();
    });

    it('does not store undefined results', async () => {
        const storage = memory();
        const cache = { storage: storage.storage, latestVersion: 1, scope: identity() };
        expect(
            await createClient(api().client, 'room', undefined, { cache }).theme(),
        ).toBeUndefined();
        await flush();
        expect(storage.set).not.toHaveBeenCalled();
    });

    it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
        'rejects a negative TTL of %p',
        (negativeTtl) => {
            const cache = {
                storage: memory().storage,
                latestVersion: 1,
                scope: identity(),
                negativeTtl,
            };
            expect(() => createClient(api().client, 'room', undefined, { cache })).toThrow(
                RangeError,
            );
        },
    );
});
