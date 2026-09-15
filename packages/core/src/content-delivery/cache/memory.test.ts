import { createSharedMemoryCache, RECORDS_LIMIT } from './memory';

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

    it('should garbage-collect old cache records when threshold is reached (with a chance of 1/100)', () => {
        const cache = createSharedMemoryCache();

        for (let i = 0; i < RECORDS_LIMIT; i += 1) {
            cache.set(`record-${i}`, `value-${i}`, 0);
        }

        for (let i = 0; i < RECORDS_LIMIT; i += 1) {
            expect(cache.get(`record-${i}`, 0)).toBe(`value-${i}`);
        }

        // Write 10% more records, 10 times to trigger CG
        for (let repeat = 0; repeat < 100; repeat += 1) {
            for (let i = RECORDS_LIMIT; i < RECORDS_LIMIT * 1.1; i += 1) {
                cache.set(`record-${i}`, `value-${i}`, 0);
            }
        }

        // the oldest part of the cache should be removed already
        for (let i = 0; i < RECORDS_LIMIT * 0.09; i += 1) {
            expect(cache.get(`record-${i}`, 0)).toBeUndefined();
        }

        // and the rest kept
        for (let i = RECORDS_LIMIT * 0.11; i < RECORDS_LIMIT * 1.1; i += 1) {
            expect(cache.get(`record-${i}`, 0)).toBe(`value-${i}`);
        }
    });
});
