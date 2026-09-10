import { RequestCoalescer } from './RequestCoalescer';

function deferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<T>((yes, no) => {
        resolve = yes;
        reject = no;
    });
    return { promise, resolve, reject };
}
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

describe('RequestCoalescer', () => {
    it('shares a pending request and frees the key after a rejected invocation', async () => {
        const requests = new RequestCoalescer();
        const pending = deferred<{ value: string }>();
        const invoke = jest.fn(() => pending.promise);
        const first = requests.run('key', invoke);
        expect(requests.run('key', invoke)).toBe(first);
        const rejected = expect(first).rejects.toThrow('upstream failed');
        pending.reject(new Error('upstream failed'));
        await rejected;
        await expect(requests.run('key', async () => ({ value: 'recovered' }))).resolves.toBe(
            'recovered',
        );
        expect(invoke).toHaveBeenCalledTimes(1);
    });

    it('returns successful data immediately but retains ownership until the write completes', async () => {
        const requests = new RequestCoalescer();
        const write = deferred<void>();
        const invoke = jest.fn(async () => ({ value: 'data', cacheWrite: write.promise }));
        expect(await requests.run('key', invoke)).toBe('data');
        expect(await requests.run('key', invoke)).toBe('data');
        expect(invoke).toHaveBeenCalledTimes(1);
        write.resolve();
        await flush();
        expect(await requests.run('key', invoke)).toBe('data');
        expect(invoke).toHaveBeenCalledTimes(2);
    });

    it('does not reject delivered data or retain a key when its write fails', async () => {
        const requests = new RequestCoalescer();
        const write = deferred<void>();
        expect(
            await requests.run('key', async () => ({ value: 'data', cacheWrite: write.promise })),
        ).toBe('data');
        write.reject(new Error('cache unavailable'));
        await flush();
        expect(await requests.run('key', async () => ({ value: 'fresh' }))).toBe('fresh');
    });

    it('bounds distinct pending keys while admitting followers for an existing key', async () => {
        const requests = new RequestCoalescer(1);
        const pending = deferred<{ value: number }>();
        const first = requests.run('first', () => pending.promise);
        const notInvoked = jest.fn();
        await expect(requests.run('second', notInvoked)).rejects.toThrow(
            'Too many pending content requests',
        );
        expect(notInvoked).not.toHaveBeenCalled();
        expect(requests.run('first', notInvoked)).toBe(first);
        pending.resolve({ value: 1 });
        await first;
        await flush();
        expect(await requests.run('second', async () => ({ value: 2 }))).toBe(2);
    });
});
