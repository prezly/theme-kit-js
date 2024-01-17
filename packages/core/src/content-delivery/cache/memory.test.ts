import { createSharedMemoryCache, RECORDS_LIMIT } from './memory';

describe('createSharedMemoryCache', () => {
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
        for (let repeat = 0; repeat < 10; repeat += 1) {
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
