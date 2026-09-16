import {
    clearSharedMemoryCache,
    configureSharedMemoryCache,
    createSharedMemoryCache,
    inspectSharedMemoryCache,
} from './memory';

describe('createSharedMemoryCache', () => {
    afterEach(() => jest.useRealTimers());

    it.each([null, false, 0, ''])('returns a stored %p as a hit', (value) => {
        const cache = createSharedMemoryCache(`falsy-${String(value)}:`);
        const onSource = jest.fn();

        cache.set('key', value, 0);

        expect(cache.get('key', 0, onSource)).toBe(value);
        expect(onSource).toHaveBeenCalledWith('memory');
    });

    it('expires entries stored with a ttl without renewing them on read', () => {
        jest.useFakeTimers();
        const cache = createSharedMemoryCache('ttl:');

        cache.set('short', null, 0, { ttl: 1 });
        cache.set('long', 'kept', 0);

        expect(cache.get('short', 0)).toBeNull();
        jest.advanceTimersByTime(900);
        expect(cache.get('short', 0)).toBeNull();
        jest.advanceTimersByTime(101);
        expect(cache.get('short', 0)).toBeUndefined();
        expect(cache.get('long', 0)).toBe('kept');
    });

    it('drops a short-lived entry on a version change', () => {
        const cache = createSharedMemoryCache('ttl-version:');

        cache.set('key', null, 1, { ttl: 60 });

        expect(cache.get('key', 2)).toBeUndefined();
        expect(cache.get('key', 1)).toBeUndefined();
    });

    it('should write and read keys', () => {
        const cache = createSharedMemoryCache();

        expect(cache.get('hello', 0)).toBeUndefined();

        cache.set('hello', 'world', 0);

        expect(cache.get('hello', 0)).toBe('world');
    });

    it('should delete accessed records if the current version is higher', () => {
        const cache = createSharedMemoryCache();

        cache.set('hello', 'world', 0);

        expect(cache.get('hello', 0)).toBe('world');
        expect(cache.get('hello', 1)).toBeUndefined();
        expect(cache.get('hello', 0)).toBeUndefined();
    });

    it('should separate datasets by namespace', () => {
        const cache = createSharedMemoryCache();
        const a = cache.namespace('a:');
        const b = cache.namespace('b:');

        a.set('hello', 'world', 0);
        b.set('hello', 'universe', 0);

        expect(cache.get('hello', 0)).toBeUndefined();
        expect(a.get('hello', 0)).toBe('world');
        expect(b.get('hello', 0)).toBe('universe');
    });

    it('evicts the least recently used entries once the record bound is reached', () => {
        clearSharedMemoryCache();
        configureSharedMemoryCache({ maxRecords: 3 });
        try {
            const cache = createSharedMemoryCache('lru:');
            cache.set('a', 1, 0);
            cache.set('b', 2, 0);
            cache.set('c', 3, 0);
            expect(cache.get('a', 0)).toBe(1); // a becomes most recently used
            cache.set('d', 4, 0); // evicts b, the least recently used
            expect(cache.get('b', 0)).toBeUndefined();
            expect(cache.get('a', 0)).toBe(1);
            expect(cache.get('c', 0)).toBe(3);
            expect(cache.get('d', 0)).toBe(4);
            expect(inspectSharedMemoryCache().records).toBe(3);
        } finally {
            configureSharedMemoryCache();
            clearSharedMemoryCache();
        }
    });

    it('evicts by estimated bytes and accounts for overwrites and removals', () => {
        clearSharedMemoryCache();
        configureSharedMemoryCache({ maxBytes: 200 });
        try {
            const cache = createSharedMemoryCache('bytes:');
            const big = 'x'.repeat(120);
            cache.set('one', big, 0);
            expect(inspectSharedMemoryCache().bytes).toBeGreaterThan(120);
            cache.set('two', big, 0); // two entries exceed 200 bytes: one is evicted
            expect(cache.get('one', 0)).toBeUndefined();
            expect(cache.get('two', 0)).toBe(big);
            cache.set('two', 'tiny', 0); // overwrite releases the old size
            expect(inspectSharedMemoryCache().bytes).toBeLessThan(40);
            expect(cache.get('two', 1)).toBeUndefined(); // version removal releases the rest
            expect(inspectSharedMemoryCache().bytes).toBe(0);
        } finally {
            configureSharedMemoryCache();
            clearSharedMemoryCache();
        }
    });

    it('rejects invalid bounds', () => {
        expect(() => configureSharedMemoryCache({ maxRecords: 0 })).toThrow(RangeError);
        expect(() => configureSharedMemoryCache({ maxBytes: 1.5 })).toThrow(RangeError);
        configureSharedMemoryCache();
    });

    it('exposes version and remaining retention through lookup', () => {
        jest.useFakeTimers();
        const cache = createSharedMemoryCache('lookup:');
        cache.set('content', { a: 1 }, 7);
        cache.set('missing', null, 7, { ttl: 30 });
        expect(cache.lookup?.('content', 7)).toEqual({
            value: { a: 1 },
            version: 7,
            ttl: undefined,
            layer: 'memory',
        });
        jest.advanceTimersByTime(10_000);
        expect(cache.lookup?.('missing', 7)).toEqual({
            value: null,
            version: 7,
            ttl: 20,
            layer: 'memory',
        });
        expect(cache.lookup?.('content', 8)).toBeUndefined();
        expect(cache.lookup?.('absent', 7)).toBeUndefined();
    });
});
