import type { PrezlyClient } from '@prezly/sdk';
import { Story } from '@prezly/sdk';

import type { Cache } from './cache';
import { createClient } from './ContentDelivery';

function memory() {
    const entries = new Map<string, { version: number; value: any }>();
    const get = jest.fn((key: string, version: number) => {
        const entry = entries.get(key);
        return entry && entry.version >= version ? entry.value : undefined;
    });
    const set = jest.fn(async (key: string, value: any, version: number) => {
        entries.set(key, { value, version });
    });
    function storage(prefix = ''): Cache {
        return {
            get: (key, version) => get(prefix + key, version),
            set: (key, value, version) => set(prefix + key, value, version),
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
});
