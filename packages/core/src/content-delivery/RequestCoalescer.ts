interface Result<T> {
    value: T;
    cacheWrite?: Promise<unknown>;
}

const CACHE_WRITE_RETENTION_MS = 1000;

/** Shares running work, then retains its result for a bounded cache-write window. */
export class RequestCoalescer {
    private readonly pending = new Map<string, Promise<unknown>>();

    constructor(private readonly limit = 1024) {
        if (!Number.isInteger(limit) || limit < 1) {
            throw new RangeError('The pending content request limit must be a positive integer.');
        }
    }

    run<T>(
        key: string,
        invoke: () => Promise<Result<T>>,
        observer?: (event: 'coalesced' | 'rejected') => unknown,
    ): Promise<T> {
        const existing = this.pending.get(key);
        if (existing) {
            notify(observer, 'coalesced');
            return existing as Promise<T>;
        }
        if (this.pending.size >= this.limit) {
            notify(observer, 'rejected');
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
            let writeTimer: ReturnType<typeof setTimeout> | undefined;
            try {
                const { value, cacheWrite } = await invoke();
                resolve(value);
                // Followers can already use the value while the cache commits.
                // Arbitrary caches may never settle: release ownership at the
                // deadline while still observing a late write rejection.
                if (cacheWrite) {
                    await Promise.race([
                        cacheWrite,
                        new Promise<void>((release) => {
                            writeTimer = setTimeout(release, CACHE_WRITE_RETENTION_MS);
                        }),
                    ]);
                }
            } catch (error) {
                reject(error);
            } finally {
                clearTimeout(writeTimer);
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
import { notify } from './telemetry';
