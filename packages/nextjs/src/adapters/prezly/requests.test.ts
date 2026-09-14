import { once } from 'node:events';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import { createBoundedFetch, FetchScheduler } from './requests';

function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((yes) => {
        resolve = yes;
    });
    return { promise, resolve };
}
const tick = async () => {
    for (let i = 0; i < 10; i++) await Promise.resolve();
};

describe('Content HTTP admission', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('limits active work, serves queued work in order, and rejects overflow', async () => {
        const scheduler = new FetchScheduler({ concurrency: 1, queueLimit: 2 });
        const first = deferred<number>();
        const started: number[] = [];
        const a = scheduler.run(async () => {
            started.push(1);
            return first.promise;
        });
        const b = scheduler.run(async () => {
            started.push(2);
            return 2;
        });
        const c = scheduler.run(async () => {
            started.push(3);
            return 3;
        });
        const overflow = jest.fn(async () => 4);
        await expect(scheduler.run(overflow)).rejects.toThrow('queue is full');
        expect(started).toEqual([1]);
        expect(overflow).not.toHaveBeenCalled();
        first.resolve(1);
        expect(await Promise.all([a, b, c])).toEqual([1, 2, 3]);
        expect(started).toEqual([1, 2, 3]);
        await tick();
        expect(jest.getTimerCount()).toBe(0);
    });

    it('removes expired and canceled queued work before it reaches the origin', async () => {
        const scheduler = new FetchScheduler({ concurrency: 1, queueLimit: 1 });
        const first = deferred<number>();
        const a = scheduler.run(() => first.promise);
        const queued = jest.fn(async () => 2);
        const expired = expect(scheduler.run(queued)).rejects.toThrow('queue wait timed out');
        await jest.advanceTimersByTimeAsync(1000);
        await expired;
        const controller = new AbortController();
        const canceled = expect(scheduler.run(queued, controller.signal)).rejects.toThrow('cancel');
        controller.abort(new Error('cancel'));
        await canceled;
        const recovered = scheduler.run(async () => 3);
        first.resolve(1);
        expect(await Promise.all([a, recovered])).toEqual([1, 3]);
        expect(queued).not.toHaveBeenCalled();
    });

    it('aborts a timed out transport and admits a subsequent retry', async () => {
        const scheduler = new FetchScheduler({ concurrency: 1, requestTimeout: 100 });
        let signal!: AbortSignal;
        const timedOut = expect(
            scheduler.run((s) => {
                signal = s;
                return new Promise((_, reject) =>
                    s.addEventListener('abort', () => reject(s.reason)),
                );
            }),
        ).rejects.toThrow('timed out');
        await jest.advanceTimersByTimeAsync(100);
        await timedOut;
        expect(signal.aborted).toBe(true);
        expect(await scheduler.run(async () => 'recovered')).toBe('recovered');
    });

    it('retains the physical slot if custom work ignores abort', async () => {
        const scheduler = new FetchScheduler({
            concurrency: 1,
            queueLimit: 0,
            requestTimeout: 100,
        });
        const pending = deferred<number>();
        const timedOut = expect(scheduler.run(() => pending.promise)).rejects.toThrow('timed out');
        await jest.advanceTimersByTimeAsync(100);
        await timedOut;
        await expect(scheduler.run(async () => 2)).rejects.toThrow('queue is full');
        pending.resolve(1);
        await tick();
        expect(await scheduler.run(async () => 3)).toBe(3);
    });

    it('forwards active cancellation and never starts an already canceled call', async () => {
        const scheduler = new FetchScheduler({ concurrency: 1 });
        const controller = new AbortController();
        let signal!: AbortSignal;
        const canceled = expect(
            scheduler.run((s) => {
                signal = s;
                return new Promise((_, reject) =>
                    s.addEventListener('abort', () => reject(s.reason)),
                );
            }, controller.signal),
        ).rejects.toThrow('cancel');
        await tick();
        controller.abort(new Error('cancel'));
        await canceled;
        expect(signal.aborted).toBe(true);
        const invoke = jest.fn(async () => 1);
        await expect(scheduler.run(invoke, controller.signal)).rejects.toThrow('cancel');
        expect(invoke).not.toHaveBeenCalled();
        await tick();
        expect(await scheduler.run(async () => 'ok')).toBe('ok');
    });

    it('keeps the deadline through response body consumption', async () => {
        const scheduler = new FetchScheduler({ requestTimeout: 100 });
        const transport: typeof fetch = async (_input, init) =>
            new Response(
                new ReadableStream({
                    start(controller) {
                        init!.signal!.addEventListener('abort', () =>
                            controller.error(init!.signal!.reason),
                        );
                    },
                }),
            );
        const bounded = createBoundedFetch(transport, scheduler);
        const timedOut = expect(bounded('https://example.test')).rejects.toThrow('timed out');
        await jest.advanceTimersByTimeAsync(100);
        await timedOut;
        const empty = createBoundedFetch(
            async () => new Response(null, { status: 204 }),
            scheduler,
        );
        expect((await empty('https://example.test')).status).toBe(204);
    });
});

it('aborts a real HTTP response stalled after headers and then recovers', async () => {
    jest.useRealTimers();
    const server = createServer((request, response) => {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (request.url === '/stall') {
            response.write('{');
        } else {
            response.end('{"ok":true}');
        }
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const fetch = createBoundedFetch(
        globalThis.fetch,
        new FetchScheduler({ concurrency: 1, requestTimeout: 200 }),
    );
    try {
        await expect(fetch(`${url}/stall`)).rejects.toThrow('timed out');
        const result = await fetch(`${url}/ok`);
        expect(await result.json()).toEqual({ ok: true });
    } finally {
        server.closeAllConnections();
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
});
