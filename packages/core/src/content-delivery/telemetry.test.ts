import { createClient } from './ContentDelivery';
import { createSharedMemoryCache, createStackedCache, type Cache } from './cache';
import { RequestCoalescer } from './RequestCoalescer';
import { createMetricsCollector } from './metrics';
import { type TelemetryEvent, notify } from './telemetry';

let sequence = 0;
const tick = () => new Promise<void>((resolve) => setImmediate(resolve));
const sdk = (get = jest.fn(async () => ({ name: 'private-payload' }))) =>
    ({ newsrooms: { get } }) as any;

it('counts concurrent callers once each, one origin, and a later valid memory hit', async () => {
    const events: TelemetryEvent[] = [];
    const observe = (event: TelemetryEvent) => {
        events.push(event);
    };
    const storage = createSharedMemoryCache(`telemetry-${sequence++}`);
    const clientSdk = sdk();
    const client = () =>
        createClient(clientSdk, 'private-newsroom', undefined, {
            cache: { storage, latestVersion: 1, scope: 'private-token-scope' },
            telemetry: { observe, source: 'prezly' },
        });
    await Promise.all(Array.from({ length: 20 }, () => client().newsroom()));
    await tick();
    await client().newsroom();
    expect(clientSdk.newsrooms.get).toHaveBeenCalledTimes(1);
    expect(events.filter((e) => e.type === 'content_request')).toHaveLength(21);
    expect(events.filter((e) => e.type === 'coalesced')).toHaveLength(19);
    expect(events.filter((e) => e.type === 'cache_miss')).toHaveLength(1);
    expect(events.filter((e) => e.type === 'origin')).toEqual([
        expect.objectContaining({ operation: 'newsroom', outcome: 'success' }),
    ]);
    expect(events.filter((e) => e.type === 'cache_hit')).toEqual([
        expect.objectContaining({ layer: 'memory' }),
    ]);
    expect(JSON.stringify(events)).not.toMatch(/private-|payload|token|cacheKey/);
});

it.each([
    ['a mismatched scope', { scope: 'another-secret', value: { name: 'room' } }, false],
    ['a stored null', { scope: 'scope', value: null }, true],
])('reports %s as a cache hit: %p', async (_label, value, hit) => {
    const events: TelemetryEvent[] = [];
    const storage: Cache = {
        get: (_key, _version, source) => {
            source?.('redis');
            return value as any;
        },
        set: () => {},
        namespace() {
            return this;
        },
    };
    await createClient(sdk(), 'room', undefined, {
        cache: { storage, latestVersion: 1, scope: 'scope' },
        telemetry: {
            observe: (e) => {
                events.push(e);
            },
        },
    }).newsroom();
    await tick();
    expect(events.some((e) => e.type === 'cache_hit')).toBe(hit);
    expect(events.filter((e) => e.type === 'cache_miss')).toHaveLength(hit ? 0 : 1);
});

it('attributes a valid lower-layer hit after version and scope validation', async () => {
    const events: TelemetryEvent[] = [];
    const empty: Cache = {
        get: () => undefined,
        set: () => {},
        namespace() {
            return this;
        },
    };
    const redis: Cache = {
        get: (_key, _version, source) => {
            source?.('redis');
            return { scope: 'scope', value: { name: 'room' } } as any;
        },
        set: () => {},
        namespace() {
            return this;
        },
    };
    const origin = sdk();
    await createClient(origin, 'room', undefined, {
        cache: { storage: createStackedCache([empty, redis]), latestVersion: 1, scope: 'scope' },
        telemetry: {
            observe: (e) => {
                events.push(e);
            },
        },
    }).newsroom();
    expect(origin.newsrooms.get).not.toHaveBeenCalled();
    expect(events.filter((e) => e.type === 'cache_hit')).toEqual([
        expect.objectContaining({ layer: 'redis' }),
    ]);
});

it('observes read and write errors without changing successful origin fallback', async () => {
    const events: TelemetryEvent[] = [];
    const cache: Cache = {
        get: () => {
            throw Error('secret-read');
        },
        set: () => Promise.reject(Error('secret-write')),
        namespace() {
            return this;
        },
    };
    const value = await createClient(sdk(), 'room', undefined, {
        cache: { storage: cache, latestVersion: 1 },
        telemetry: {
            observe: (e) => {
                events.push(e);
            },
        },
    }).newsroom();
    await tick();
    expect(value.name).toBe('private-payload');
    expect(events.filter((e) => e.type === 'cache_error')).toEqual([
        expect.objectContaining({ action: 'read' }),
        expect.objectContaining({ action: 'write' }),
    ]);
    expect(JSON.stringify(events)).not.toContain('secret');
});

it.each(['sync', 'async'])(
    'a failing %s observer cannot change results or poison retries',
    async (kind) => {
        const observer =
            kind === 'sync'
                ? () => {
                      throw Error('observer');
                  }
                : async () => {
                      throw Error('observer');
                  };
        const get = jest
            .fn()
            .mockRejectedValueOnce(Error('origin'))
            .mockResolvedValue({ name: 'recovered' });
        const client = createClient(sdk(get), 'room', undefined, {
            telemetry: { observe: observer },
            cache: { storage: createSharedMemoryCache(`errors-${sequence++}`), latestVersion: 1 },
        });
        await expect(client.newsroom()).rejects.toThrow('origin');
        await expect(client.newsroom()).resolves.toEqual({ name: 'recovered' });
        await tick();
    },
);

it('preserves synchronous no-cache results with telemetry enabled', () => {
    const events: TelemetryEvent[] = [];
    const client = createClient(sdk(), 'room', undefined, {
        telemetry: {
            observe: (e) => {
                events.push(e);
            },
        },
    });
    expect(client.theme()).toBeUndefined();
    expect(events.map((e) => e.type)).toEqual(['content_request', 'origin']);
});

it('reports pending-limit rejection and sharing without exposing keys', async () => {
    const coalescer = new RequestCoalescer(1);
    const events: string[] = [];
    let release!: (value: { value: string }) => void;
    const one = coalescer.run(
        'secret-a',
        () =>
            new Promise((r) => {
                release = r;
            }),
        (e) => events.push(e),
    );
    const joined = coalescer.run(
        'secret-a',
        async () => ({ value: 'unexpected' }),
        (e) => events.push(e),
    );
    await expect(
        coalescer.run(
            'secret-b',
            async () => ({ value: 'unexpected' }),
            (e) => events.push(e),
        ),
    ).rejects.toThrow('Too many pending');
    release({ value: 'ok' });
    expect(await one).toBe('ok');
    expect(await joined).toBe('ok');
    expect(events).toEqual(['coalesced', 'rejected']);
});

it('renders bounded numeric Prometheus data and initializes observed outcome families to zero', () => {
    const metrics = createMetricsCollector({ runtime: 'node' });
    metrics.observe({ type: 'content_request', operation: 'story', source: 'prezly' });
    metrics.observe({
        type: 'origin',
        operation: 'story',
        source: 'prezly',
        outcome: 'success',
        seconds: 0.02,
    });
    const text = metrics.render();
    expect(text).toContain('theme_kit_metrics_info{runtime="node",schema="1"} 1');
    expect(text).toContain(
        'theme_kit_content_cache_hits_total{runtime="node",operation="story",source="prezly",layer="memory"} 0',
    );
    expect(text).toContain(
        'theme_kit_content_origin_duration_seconds_bucket{runtime="node",operation="story",source="prezly",le="0.025"} 1',
    );
    expect(text).toContain(
        'theme_kit_content_origin_duration_seconds_bucket{runtime="node",operation="story",source="prezly",le="+Inf"} 1',
    );
    expect(text).toContain(
        'theme_kit_content_origin_duration_seconds_sum{runtime="node",operation="story",source="prezly"} 0.02',
    );
});

it('does not retain caller-controlled labels or non-finite observations', () => {
    const metrics = createMetricsCollector();
    for (let i = 0; i < 10000; i++)
        metrics.observe({
            type: 'cache_hit',
            operation: `secret-key-${i}`,
            source: `secret-url-${i}`,
            layer: `secret-layer-${i}`,
        } as any);
    const text = metrics.render();
    expect(text).not.toContain('secret');
    expect(text.length).toBeLessThan(200000);
    for (const seconds of [Number.NaN, Number.POSITIVE_INFINITY, -1])
        metrics.observe({
            type: 'origin',
            operation: 'story',
            source: 'prezly',
            outcome: 'success',
            seconds,
        });
    expect(metrics.render()).toBe(text);
});

it('observes rejecting thenables as well as native promises', async () => {
    notify(() => Promise.reject(Error('ignored')), {});
    await tick();
});

it('attributes a legacy fallback to custom when an earlier layer returns undefined', async () => {
    const memory = createSharedMemoryCache(`undefined-layer-${sequence++}`);
    const emptyMemory: Cache = {
        get(key, version, source) {
            memory.set(key, undefined, version);
            return memory.get(key, version, source);
        },
        set: () => {},
        namespace() {
            return this;
        },
    };
    const announcingMiss: Cache = {
        get(_key, _version, source) {
            source?.('redis');
            return undefined;
        },
        set: () => {},
        namespace() {
            return this;
        },
    };
    const legacy: Cache = {
        get: () => ({ scope: 'scope', value: { name: 'legacy-hit' } }) as any,
        set: () => {},
        namespace() {
            return this;
        },
    };
    for (const first of [emptyMemory, announcingMiss]) {
        const events: TelemetryEvent[] = [];
        const origin = sdk();
        const client = createClient(origin, `fallback-${sequence++}`, undefined, {
            cache: {
                storage: createStackedCache([first, legacy]),
                latestVersion: 1,
                scope: 'scope',
            },
            telemetry: {
                observe: (e) => {
                    events.push(e);
                },
            },
        });
        expect(await client.newsroom()).toEqual({ name: 'legacy-hit' });
        expect(origin.newsrooms.get).not.toHaveBeenCalled();
        expect(events.filter((e) => e.type === 'cache_hit')).toEqual([
            expect.objectContaining({ layer: 'custom' }),
        ]);
    }
});
