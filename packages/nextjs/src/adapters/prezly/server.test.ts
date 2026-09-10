import { Story, createPrezlyClient } from '@prezly/sdk';
import { ContentDelivery } from '@prezly/theme-kit-core';

import { createBoundedFetch, FetchScheduler } from './requests';
import { PrezlyAdapter } from './server';

const tick = () => new Promise<void>((resolve) => setImmediate(resolve));
const nativeFetch = globalThis.fetch;
let sequence = 0;
const config = { newsroom: 'room', accessToken: 'test-token', baseUrl: 'https://example.test' };
const cache = () => ({ memory: true, latestVersion: 1, namespace: `adapter-test-${sequence++}` });

function response(name: string) {
    return new Response(JSON.stringify({ newsroom: { name, stories_number: 600 } }), {
        headers: { 'content-type': 'application/json' },
    });
}

afterEach(() => {
    globalThis.fetch = nativeFetch;
});

it('coalesces 20 independently constructed adapters and then uses the warm cache', async () => {
    const fetchMock = jest.fn(async () => response('room'));
    globalThis.fetch = fetchMock;
    const caching = cache();
    const client = () =>
        PrezlyAdapter.connect(config, { cache: caching }).usePrezlyClient().contentDelivery;
    const values = await Promise.all(Array.from({ length: 20 }, () => client().newsroom()));
    expect(values.every((value) => value.name === 'room')).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await tick();
    await client().newsroom();
    expect(fetchMock).toHaveBeenCalledTimes(1);
});

it.each([
    ['token', { accessToken: 'second-token' }],
    ['source', { baseUrl: 'https://another.example.test' }],
    ['headers', { headers: { 'x-test-scope': 'second' } }],
])('isolates concurrent and warm values by %s', async (_label, change) => {
    const fetchMock = jest.fn(async (url: any, init?: RequestInit) =>
        response(JSON.stringify([url, init?.headers])),
    );
    globalThis.fetch = fetchMock;
    const caching = cache();
    const a = () =>
        PrezlyAdapter.connect(config, { cache: caching }).usePrezlyClient().contentDelivery;
    const b = () =>
        PrezlyAdapter.connect({ ...config, ...change }, { cache: caching }).usePrezlyClient()
            .contentDelivery;
    const [first, second] = await Promise.all([a().newsroom(), b().newsroom()]);
    expect(first.name).not.toBe(second.name);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await tick();
    expect((await a().newsroom()).name).toBe(first.name);
    await tick();
    expect((await b().newsroom()).name).toBe(second.name);
});

it('isolates newsroom, theme, formats, namespace and invalidation version', async () => {
    const fetchMock = jest.fn(async () => response('room'));
    globalThis.fetch = fetchMock;
    const caching = cache();
    const variants: [PrezlyAdapter.Configuration, PrezlyAdapter.CacheConfiguration][] = [
        [config, caching],
        [{ ...config, newsroom: 'another' }, caching],
        [{ ...config, theme: 'theme' }, caching],
        [{ ...config, formats: [Story.FormatVersion.SLATEJS_V6] }, caching],
        [config, { ...caching, namespace: `${caching.namespace}-other` }],
        [config, { ...caching, latestVersion: 2 }],
    ];
    await Promise.all(
        variants.map(([cfg, storage]) =>
            PrezlyAdapter.connect(cfg, { cache: storage })
                .usePrezlyClient()
                .contentDelivery.newsroom(),
        ),
    );
    expect(fetchMock).toHaveBeenCalledTimes(6);
    await tick();
    await PrezlyAdapter.connect(config, { cache: { ...caching, latestVersion: 3 } })
        .usePrezlyClient()
        .contentDelivery.newsroom();
    expect(fetchMock).toHaveBeenCalledTimes(7);
});

it('requires explicit scope to share custom fetch across adapter instances', async () => {
    const fetchMock = jest.fn(async () => response('room'));
    const create = (caching: PrezlyAdapter.CacheConfiguration) =>
        PrezlyAdapter.connect(config, { cache: caching, fetch: fetchMock }).usePrezlyClient()
            .contentDelivery;
    const unscoped = cache();
    await Promise.all([create(unscoped).newsroom(), create(unscoped).newsroom()]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const scoped = { ...cache(), requestScope: 'immutable-custom-transport' };
    await Promise.all([create(scoped).newsroom(), create(scoped).newsroom()]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
});

it('does not buffer or change calls made using the raw SDK client', async () => {
    const result = response('raw');
    const read = jest.spyOn(result, 'arrayBuffer');
    const fetchMock = jest.fn(async (_input: any, _init?: RequestInit) => result);
    const { client } = PrezlyAdapter.connect(config, {
        cache: cache(),
        fetch: fetchMock,
    }).usePrezlyClient();
    expect((await client.newsrooms.get('room')).name).toBe('raw');
    expect(read).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls[0][1]).not.toHaveProperty('signal');
});

it('recovers from an actual SDK error without poisoning the shared key', async () => {
    const fetchMock = jest.fn(async () => response('recovered'));
    fetchMock.mockRejectedValueOnce(new Error('offline'));
    globalThis.fetch = fetchMock;
    const caching = cache();
    const client = () =>
        PrezlyAdapter.connect(config, { cache: caching }).usePrezlyClient().contentDelivery;
    const failed = await Promise.allSettled(Array.from({ length: 20 }, () => client().newsroom()));
    expect(failed.every((value) => value.status === 'rejected')).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((await client().newsroom()).name).toBe('recovered');
    expect(fetchMock).toHaveBeenCalledTimes(2);
});

it('fetches every allStories page through the SDK with only one transport slot', async () => {
    const fetchMock = jest.fn(async (url: any, init?: RequestInit) => {
        if (String(url).endsWith('/room')) return response('room');
        const { offset } = JSON.parse(init!.body as string);
        return new Response(JSON.stringify({ stories: [offset] }));
    });
    const sdk = createPrezlyClient({
        ...config,
        fetch: createBoundedFetch(fetchMock, new FetchScheduler({ concurrency: 1 })),
    });
    const caching = {
        storage: ContentDelivery.createSharedMemoryCache(),
        scope: `aggregate-${sequence++}`,
        latestVersion: 1,
    };
    const clients = Array.from({ length: 20 }, () =>
        ContentDelivery.createClient(sdk, 'room', undefined, { cache: caching }),
    );
    expect(await Promise.all(clients.map((client) => client.allStories()))).toEqual(
        Array.from({ length: 20 }, () => [0, 200, 400]),
    );
    expect(fetchMock).toHaveBeenCalledTimes(4);
});

it('handles a large newsroom without overflowing its own global transport queue', async () => {
    let active = 0;
    let peak = 0;
    const fetchMock = jest.fn(async (url: any, init?: RequestInit) => {
        if (String(url).endsWith('/room')) {
            return new Response(
                JSON.stringify({ newsroom: { name: 'large', stories_number: 60000 } }),
            );
        }
        active++;
        peak = Math.max(active, peak);
        await tick();
        active--;
        const { offset } = JSON.parse(init!.body as string);
        return new Response(JSON.stringify({ stories: [offset] }));
    });
    globalThis.fetch = fetchMock;
    const caching = cache();
    const request = () =>
        PrezlyAdapter.connect(config, { cache: caching })
            .usePrezlyClient()
            .contentDelivery.allStories();
    const expected = Array.from({ length: 300 }, (_, index) => index * 200);
    expect(await Promise.all(Array.from({ length: 20 }, request))).toEqual(
        Array.from({ length: 20 }, () => expected),
    );
    expect(fetchMock).toHaveBeenCalledTimes(301);
    expect(peak).toBeLessThanOrEqual(8);
});

it('stops producing later story batches on failure and can retry the aggregate', async () => {
    let fail = true;
    const fetchMock = jest.fn(async (url: any, init?: RequestInit) => {
        if (String(url).endsWith('/room')) {
            return new Response(JSON.stringify({ newsroom: { stories_number: 60000 } }));
        }
        const { offset } = JSON.parse(init!.body as string);
        if (offset === 0 && fail) throw new Error('page unavailable');
        return new Response(JSON.stringify({ stories: [offset] }));
    });
    globalThis.fetch = fetchMock;
    const adapter = PrezlyAdapter.connect(config, { cache: cache() });
    await expect(adapter.usePrezlyClient().contentDelivery.allStories()).rejects.toThrow(
        'page unavailable',
    );
    await tick();
    expect(fetchMock).toHaveBeenCalledTimes(9); // newsroom + the first bounded batch only
    fail = false;
    expect(await adapter.usePrezlyClient().contentDelivery.allStories()).toHaveLength(300);
});
