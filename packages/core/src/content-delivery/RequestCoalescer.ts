interface Result<T> {
    value: T;
    cacheWrite?: Promise<unknown>;
}

/** Shares work only while it is running or committing its cache write. */
export class RequestCoalescer {
    private readonly pending = new Map<string, Promise<unknown>>();

    constructor(private readonly limit = 1024) {
        if (!Number.isInteger(limit) || limit < 1) {
            throw new RangeError('The pending content request limit must be a positive integer.');
        }
    }

    run<T>(key: string, invoke: () => Promise<Result<T>>): Promise<T> {
        const existing = this.pending.get(key);
        if (existing) return existing as Promise<T>;
        if (this.pending.size >= this.limit) {
            return Promise.reject(new Error('Too many pending content requests.'));
        }

        let resolve!: (value: T) => void;
        let reject!: (error: unknown) => void;
        const result = new Promise<T>((yes, no) => {
            resolve = yes;
            reject = no;
        });
        // Register before invoking, including synchronous errors and cache hits.
        this.pending.set(key, result);
        void (async () => {
            try {
                const { value, cacheWrite } = await invoke();
                resolve(value);
                // Followers can already use the value while the cache commits.
                // Keep ownership to avoid another miss during a slow write.
                await cacheWrite;
            } catch (error) {
                reject(error);
            } finally {
                if (this.pending.get(key) === result) this.pending.delete(key);
            }
        })();
        return result;
    }
}

// Share across the ESM/CJS entrypoints and duplicate copies in one JS runtime.
const key = Symbol.for('@prezly/theme-kit-core/content-requests/v1');
const registry = globalThis as unknown as Record<symbol, RequestCoalescer | undefined>;
export const sharedContentRequests = (registry[key] ??= new RequestCoalescer());
