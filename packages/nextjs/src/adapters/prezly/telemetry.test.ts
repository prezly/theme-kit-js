import { ContentDelivery } from '@prezly/theme-kit-core';
import { createObservedFetch, upstreamRoute } from './telemetry';
import { createBoundedFetch, FetchScheduler } from './requests';
import { PrezlyAdapter } from './server';

const nativeFetch = globalThis.fetch;
const tick = () => new Promise<void>((resolve) => setImmediate(resolve));
afterEach(() => {
    globalThis.fetch = nativeFetch;
    jest.useRealTimers();
});

it.each([
    ['/v2/newsrooms/private-id', 'newsroom'],
    ['/v2/newsrooms/private-id/languages/en_GB', 'languages'],
    ['/v2/newsrooms/private-id/categories', 'categories'],
    ['/v2/stories/by-slug/private-slug?token=secret', 'story_by_slug'],
    ['/v2/stories/search', 'stories'],
    ['/v2/stories/private-uuid', 'story'],
    ['/custom/private-path', 'other'],
])('classifies %s without retaining URL values', (path, expected) => {
    expect(upstreamRoute(`https://private-origin.test${path}`)).toBe(expected);
});

it('observes raw response headers without consuming the body or adding a signal', async () => {
    const events: ContentDelivery.TelemetryEvent[] = [];
    const response = new Response('private-body');
    const read = jest.spyOn(response, 'arrayBuffer');
    const fetchMock = jest.fn(async () => response);
    const options = { headers: { Authorization: 'private-token' } };
    const observed = createObservedFetch(
        fetchMock,
        {
            observe: (e) => {
                events.push(e);
            },
            source: 'custom',
        },
        'raw',
    );
    expect(await observed('https://private-origin.test/v2/stories/private-uuid', options)).toBe(
        response,
    );
    expect(read).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
        'https://private-origin.test/v2/stories/private-uuid',
        options,
    );
    expect(events).toEqual([
        expect.objectContaining({
            type: 'upstream',
            client: 'raw',
            route: 'story',
            source: 'custom',
            status: '2xx',
        }),
    ]);
    expect(JSON.stringify(events)).not.toMatch(/private-/);
});

it('keeps telemetry outside the source/cache identity when adapters share work', async () => {
    const events: ContentDelivery.TelemetryEvent[] = [];
    const config = { newsroom: 'private-room', accessToken: 'private-token' };
    const cache = { memory: true, latestVersion: 1, namespace: 'metrics-adapter-sharing' };
    globalThis.fetch = jest.fn(async () => Response.json({ newsroom: { name: 'room' } }));
    const observed = PrezlyAdapter.connect(config, {
        cache,
        telemetry: (e) => {
            events.push(e);
        },
    }).usePrezlyClient();
    const plain = PrezlyAdapter.connect(config, { cache }).usePrezlyClient();
    await Promise.all([observed.contentDelivery.newsroom(), plain.contentDelivery.newsroom()]);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    await tick();
    await observed.contentDelivery.newsroom();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(events.filter((e) => e.type === 'upstream')).toHaveLength(1);
    expect(events.some((e) => e.type === 'cache_hit')).toBe(true);
});

it('reports queued, full, accepted and completed wait without changing admission limits', async () => {
    const events: ContentDelivery.TelemetryEvent[] = [];
    const telemetry = {
        observe: (e: ContentDelivery.TelemetryEvent) => {
            events.push(e);
        },
    };
    const scheduler = new FetchScheduler({ concurrency: 1, queueLimit: 1 });
    let release!: () => void;
    const active = scheduler.run(
        () =>
            new Promise<void>((r) => {
                release = r;
            }),
        undefined,
        telemetry,
        'story',
    );
    const queued = scheduler.run(async () => 42, undefined, telemetry, 'story');
    await expect(scheduler.run(async () => 0, undefined, telemetry, 'story')).rejects.toThrow(
        'queue is full',
    );
    await tick();
    release();
    await active;
    expect(await queued).toBe(42);
    await tick();
    expect(events.filter((e) => e.type === 'fetch_queue').map((e) => (e as any).outcome)).toEqual([
        'accepted',
        'queued',
        'full',
        'accepted',
    ]);
});

it('reports queue timeout and body deadline independently of successful HTTP headers', async () => {
    jest.useFakeTimers();
    const events: ContentDelivery.TelemetryEvent[] = [];
    const telemetry = {
        observe: (e: ContentDelivery.TelemetryEvent) => {
            events.push(e);
        },
    };
    const scheduler = new FetchScheduler({
        concurrency: 1,
        queueLimit: 1,
        queueTimeout: 10,
        requestTimeout: 30,
    });
    let finish!: () => void;
    const fetchMock = jest.fn(
        async () =>
            new Response(
                new ReadableStream({
                    start(controller) {
                        finish = () => controller.close();
                    },
                }),
            ),
    );
    const fetch = createBoundedFetch(
        createObservedFetch(fetchMock, telemetry, 'content'),
        scheduler,
        telemetry,
    );
    const first = fetch('https://example.test/v2/stories/search');
    const failed = expect(first).rejects.toThrow('timed out');
    const next = fetch('https://example.test/v2/stories/search');
    const queued = expect(next).rejects.toThrow('queue wait timed out');
    await jest.advanceTimersByTimeAsync(31);
    await failed;
    await queued;
    expect(events.filter((e) => e.type === 'upstream')).toEqual([
        expect.objectContaining({ status: '2xx' }),
    ]);
    expect(events.filter((e) => e.type === 'fetch_timeout')).toHaveLength(1);
    expect(events).toContainEqual(
        expect.objectContaining({ type: 'fetch_queue', outcome: 'wait_timeout' }),
    );
    finish();
    await jest.advanceTimersByTimeAsync(0);
    expect(jest.getTimerCount()).toBe(0);
});

it('a throwing or rejecting observer cannot change successful fetch outcomes', async () => {
    const response = new Response('ok');
    for (const observe of [
        () => {
            throw Error('metrics');
        },
        async () => {
            throw Error('metrics');
        },
    ]) {
        const fetch = createObservedFetch(async () => response, { observe }, 'raw');
        expect(await fetch('https://example.test')).toBe(response);
    }
    await tick();
});
