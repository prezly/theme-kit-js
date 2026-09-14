interface Limits {
    concurrency: number;
    queueLimit: number;
    queueTimeout: number;
    requestTimeout: number;
}

interface Task {
    invoke: (signal: AbortSignal) => Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
    signal?: AbortSignal | null;
    clearQueueWait: () => void;
    telemetry?: ContentDelivery.Telemetry;
    route: ContentDelivery.UpstreamRoute;
    queuedAt?: number;
}

function abortReason(signal: AbortSignal): Error {
    if (signal.reason instanceof Error) return signal.reason;
    const error = new Error('Content request aborted.');
    error.name = 'AbortError';
    return error;
}

/** Limit actual HTTP requests, not aggregate ContentDelivery methods. */
export class FetchScheduler {
    private active = 0;
    private readonly queue: Task[] = [];
    private readonly limits: Limits;

    constructor(limits: Partial<Limits> = {}) {
        this.limits = {
            concurrency: 32,
            queueLimit: 256,
            queueTimeout: 1000,
            requestTimeout: 30000,
            ...limits,
        };
        for (const [name, value] of Object.entries(this.limits)) {
            if (!Number.isInteger(value) || value < (name === 'queueLimit' ? 0 : 1)) {
                throw new RangeError('Invalid content request limits.');
            }
        }
    }

    run<T>(
        invoke: (signal: AbortSignal) => Promise<T>,
        signal?: AbortSignal | null,
        telemetry?: ContentDelivery.Telemetry,
        route: ContentDelivery.UpstreamRoute = 'other',
    ): Promise<T> {
        if (signal?.aborted) {
            ContentDelivery.emit(telemetry, {
                type: 'fetch_queue',
                route,
                outcome: 'aborted',
                seconds: 0,
            });
            return Promise.reject(abortReason(signal));
        }
        return new Promise<T>((resolve, reject) => {
            const task: Task = {
                invoke,
                resolve: (value) => resolve(value as T),
                reject,
                signal,
                clearQueueWait: () => {},
                telemetry,
                route,
            };
            if (this.active < this.limits.concurrency) {
                this.start(task);
                return;
            }
            if (this.queue.length >= this.limits.queueLimit) {
                ContentDelivery.emit(telemetry, {
                    type: 'fetch_queue',
                    route,
                    outcome: 'full',
                    seconds: 0,
                });
                reject(new Error('Content request queue is full.'));
                return;
            }
            task.queuedAt = telemetry ? ContentDelivery.telemetryNow() : undefined;
            ContentDelivery.emit(telemetry, { type: 'fetch_queue', route, outcome: 'queued' });
            const cancel = (error: Error, outcome: 'aborted' | 'wait_timeout') => {
                const index = this.queue.indexOf(task);
                if (index < 0) return;
                this.queue.splice(index, 1);
                task.clearQueueWait();
                ContentDelivery.emit(telemetry, {
                    type: 'fetch_queue',
                    route,
                    outcome,
                    seconds:
                        task.queuedAt === undefined
                            ? 0
                            : ContentDelivery.elapsedSeconds(task.queuedAt),
                });
                reject(error);
            };
            const onAbort = () => cancel(abortReason(signal!), 'aborted');
            const timer = setTimeout(
                () => cancel(new Error('Content request queue wait timed out.'), 'wait_timeout'),
                this.limits.queueTimeout,
            );
            task.clearQueueWait = () => {
                clearTimeout(timer);
                signal?.removeEventListener('abort', onAbort);
            };
            signal?.addEventListener('abort', onAbort, { once: true });
            this.queue.push(task);
        });
    }

    private start(task: Task): void {
        task.clearQueueWait();
        ContentDelivery.emit(task.telemetry, {
            type: 'fetch_queue',
            route: task.route,
            outcome: 'accepted',
            seconds:
                task.queuedAt === undefined ? 0 : ContentDelivery.elapsedSeconds(task.queuedAt),
        });
        this.active += 1;
        const controller = new AbortController();
        const rejectAbort = () => task.reject(abortReason(controller.signal));
        const forwardAbort = () => controller.abort(task.signal?.reason);
        controller.signal.addEventListener('abort', rejectAbort, { once: true });
        task.signal?.addEventListener('abort', forwardAbort, { once: true });
        const timer = setTimeout(() => {
            if (!controller.signal.aborted) {
                ContentDelivery.emit(task.telemetry, { type: 'fetch_timeout', route: task.route });
                controller.abort(new Error('Content request timed out.'));
            }
        }, this.limits.requestTimeout);

        void Promise.resolve()
            .then(() => {
                if (controller.signal.aborted) throw abortReason(controller.signal);
                return task.invoke(controller.signal);
            })
            .then((value) => {
                if (!controller.signal.aborted) task.resolve(value);
            }, task.reject)
            .finally(() => {
                clearTimeout(timer);
                controller.signal.removeEventListener('abort', rejectAbort);
                task.signal?.removeEventListener('abort', forwardAbort);
                // A custom fetch that ignores abort keeps its slot until it really
                // settles. Timeouts must not create unlimited overlapping requests.
                this.active -= 1;
                while (this.active < this.limits.concurrency && this.queue.length > 0) {
                    this.start(this.queue.shift()!);
                }
            });
    }
}

const key = Symbol.for('@prezly/theme-kit-nextjs/content-fetch-scheduler/v1');
const registry = globalThis as unknown as Record<symbol, FetchScheduler | undefined>;
const sharedContentFetches = (registry[key] ??= new FetchScheduler());

export function createBoundedFetch(
    fetchImpl: typeof fetch,
    scheduler = sharedContentFetches,
    telemetry?: ContentDelivery.Telemetry,
): typeof fetch {
    return (input, init) => {
        const signal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
        return scheduler.run(
            async (requestSignal) => {
                const response = await fetchImpl(input, { ...init, signal: requestSignal });
                // Keep the deadline and slot through body consumption, not just headers.
                // Only the internal content SDK uses this wrapper; the raw SDK is unchanged.
                const body = response.body === null ? null : await response.arrayBuffer();
                return new Response(body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                });
            },
            signal,
            telemetry,
            telemetry ? upstreamRoute(input) : 'other',
        );
    };
}
import { ContentDelivery } from '@prezly/theme-kit-core';
import { upstreamRoute } from './telemetry';
