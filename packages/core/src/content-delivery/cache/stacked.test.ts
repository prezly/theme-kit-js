import { createStackedCache } from './stacked';
import type { Cache, Lookup } from './type';

type Stored = { value: unknown; version: number; ttl?: number };

/** A layer that exposes `lookup`, with a spy on `set`. */
function layer(name: 'memory' | 'redis', entries: Record<string, Stored> = {}) {
    const store = new Map(Object.entries(entries));
    const set = jest.fn(
        async (key: string, value: unknown, version: number, options?: { ttl?: number }) => {
            store.set(key, { value, version, ttl: options?.ttl });
        },
    );
    const cache: Cache = {
        get: (key, latestVersion) => {
            const entry = store.get(key);
            return entry && entry.version >= latestVersion ? entry.value : undefined;
        },
        lookup: <T>(key: string, latestVersion: number): Lookup<T> | undefined => {
            const entry = store.get(key);
            if (!entry || entry.version < latestVersion) return undefined;
            return { value: entry.value as T, version: entry.version, ttl: entry.ttl, layer: name };
        },
        set,
        namespace() {
            return cache;
        },
    };
    return { cache, set, store };
}

/** A layer without `lookup`, as a third-party cache would be. */
function legacyLayer(entries: Record<string, Stored> = {}) {
    const store = new Map(Object.entries(entries));
    const set = jest.fn(async () => {});
    const cache: Cache = {
        get: (key, latestVersion, onSource) => {
            const entry = store.get(key);
            if (!entry || entry.version < latestVersion) return undefined;
            onSource?.('custom');
            return entry.value;
        },
        set,
        namespace() {
            return cache;
        },
    };
    return { cache, set };
}

const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

it('refills every earlier layer from a later hit with the entry version and retention', async () => {
    const memory = layer('memory');
    const redis = layer('redis', { key: { value: { name: 'room' }, version: 5 } });
    const stacked = createStackedCache([memory.cache, redis.cache]);
    const sources: string[] = [];
    expect(await stacked.get('key', 3, (source) => sources.push(source))).toEqual({ name: 'room' });
    expect(sources).toEqual(['redis']);
    await flush();
    expect(memory.set).toHaveBeenCalledWith('key', { name: 'room' }, 5, undefined);
    expect(redis.set).not.toHaveBeenCalled();
    sources.length = 0;
    expect(await stacked.get('key', 5, (source) => sources.push(source))).toEqual({ name: 'room' });
    expect(sources).toEqual(['memory']);
});

it('carries a short retention into the refilled layer', async () => {
    const memory = layer('memory');
    const redis = layer('redis', { missing: { value: null, version: 2, ttl: 45 } });
    const stacked = createStackedCache([memory.cache, redis.cache]);
    expect(await stacked.get('missing', 2)).toBeNull();
    await flush();
    expect(memory.set).toHaveBeenCalledWith('missing', null, 2, { ttl: 45 });
});

it('never refills from a stale entry or on a miss', async () => {
    const memory = layer('memory');
    const redis = layer('redis', { key: { value: 'old', version: 1 } });
    const stacked = createStackedCache([memory.cache, redis.cache]);
    expect(await stacked.get('key', 2)).toBeUndefined();
    expect(await stacked.get('absent', 1)).toBeUndefined();
    await flush();
    expect(memory.set).not.toHaveBeenCalled();
});

it('treats an entry holding undefined as a miss and reads the next layer', async () => {
    const memory = layer('memory', { key: { value: undefined, version: 1 } });
    const redis = layer('redis', { key: { value: 'value', version: 1 } });
    const stacked = createStackedCache([memory.cache, redis.cache]);
    const sources: string[] = [];
    expect(await stacked.get('key', 1, (source) => sources.push(source))).toBe('value');
    expect(sources).toEqual(['redis']);
});

it('does not refill from a layer without lookup', async () => {
    const memory = layer('memory');
    const custom = legacyLayer({ key: { value: 'custom value', version: 1 } });
    const stacked = createStackedCache([memory.cache, custom.cache]);
    const sources: string[] = [];
    expect(await stacked.get('key', 1, (source) => sources.push(source))).toBe('custom value');
    expect(sources).toEqual(['custom']);
    await flush();
    expect(memory.set).not.toHaveBeenCalled();
});

it('withholds lookup when a layer cannot report hits, so nested stacks keep those hits', async () => {
    const memory = layer('memory');
    const custom = legacyLayer({ key: { value: 'custom value', version: 1 } });
    const inner = createStackedCache([memory.cache, custom.cache]);
    expect(inner.lookup).toBeUndefined();
    const outerMemory = layer('memory');
    const outer = createStackedCache([outerMemory.cache, inner]);
    const sources: string[] = [];
    expect(await outer.get('key', 1, (source) => sources.push(source))).toBe('custom value');
    expect(sources).toEqual(['custom']);
    await flush();
    expect(outerMemory.set).not.toHaveBeenCalled();
    expect(createStackedCache([memory.cache, layer('redis').cache]).lookup).toBeDefined();
});

it('returns the hit even when a refill write fails', async () => {
    const memory = layer('memory');
    memory.set.mockRejectedValue(new Error('memory full'));
    const redis = layer('redis', { key: { value: 'value', version: 1 } });
    const stacked = createStackedCache([memory.cache, redis.cache]);
    await expect(stacked.get('key', 1)).resolves.toBe('value');
    await flush();
    expect(memory.set).toHaveBeenCalled();
});

it('exposes lookup itself so stacks can nest, and writes through to all layers', async () => {
    const memory = layer('memory');
    const redis = layer('redis', { key: { value: 'value', version: 9, ttl: 10 } });
    const stacked = createStackedCache([memory.cache, redis.cache]);
    expect(await stacked.lookup?.('key', 9)).toEqual({
        value: 'value',
        version: 9,
        ttl: 10,
        layer: 'redis',
    });
    await stacked.set('other', 'written', 3, { ttl: 5 });
    expect(memory.set).toHaveBeenCalledWith('other', 'written', 3, { ttl: 5 });
    expect(redis.set).toHaveBeenCalledWith('other', 'written', 3, { ttl: 5 });
});
