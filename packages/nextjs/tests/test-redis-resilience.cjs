// Optional local integration check. Requires redis-server on PATH and built packages.
// Starts an isolated Redis process, with persistence disabled, on a loopback port.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const net = require('node:net');
const { createClient } = require('redis');
const { createRedisCache } = require('../build/adapters/prezly/cache/redis.cjs');
const { ContentDelivery } = require('@prezly/theme-kit-core');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(check, label) {
    for (let i = 0; i < 200; i++) {
        if (await check()) return;
        await sleep(25);
    }
    throw new Error(`Timed out: ${label}`);
}

async function main() {
    const portReservation = net.createServer();
    portReservation.listen(0, '127.0.0.1');
    await once(portReservation, 'listening');
    const { port } = portReservation.address();
    await new Promise((resolve) => portReservation.close(resolve));
    const server = spawn(
        'redis-server',
        ['--bind', '127.0.0.1', '--port', String(port), '--save', '', '--appendonly', 'no'],
        { stdio: 'ignore' },
    );
    server.on('error', (error) => {
        throw error;
    });
    const url = `redis://127.0.0.1:${port}`;
    const control = createClient({ url });
    control.on('error', () => {});
    const originalConsoleError = console.error;
    console.error = () => {}; // Expected connection errors during the outage below.
    try {
        await control.connect();
        const storage = createRedisCache({ url, ttl: 60, prefix: 'resilience:' });
        await until(async () => {
            await storage.set('ready', true, 1);
            return (await storage.get('ready', 1)) === true;
        }, 'cache connection');
        let originCalls = 0;
        const sdk = {
            newsrooms: {
                get: async () => {
                    originCalls++;
                    await sleep(20);
                    return { name: 'fixture' };
                },
            },
        };
        const request = () =>
            ContentDelivery.createClient(sdk, 'room', undefined, {
                cache: { storage, scope: 'local-test', latestVersion: 1 },
            }).newsroom();
        await Promise.all(Array.from({ length: 100 }, request));
        assert.equal(originCalls, 1, 'cold burst must share one origin fetch');
        await sleep(50);
        await Promise.all(Array.from({ length: 100 }, request));
        assert.equal(originCalls, 1, 'warm burst must not reach origin');

        // Pause command processing after the socket is ready: commands have been
        // written to the socket, so this checks more than an offline queue mock.
        await control.sendCommand(['CLIENT', 'PAUSE', '2500', 'ALL']);
        const start = performance.now();
        const stalled = await Promise.allSettled(
            Array.from({ length: 300 }, (_, i) => storage.get(`paused-${i}`, 1)),
        );
        assert(stalled.every((result) => result.status === 'rejected'));
        assert(
            performance.now() - start < 2000,
            'all queued reads must settle within the command deadline',
        );
        await sleep(1800);
        assert.equal(
            await storage.get('ready', 1),
            true,
            'connection must recover after stalled replies',
        );

        // Kill just the adapter connection; the control connection remains usable.
        await control.sendCommand(['CLIENT', 'KILL', 'TYPE', 'normal', 'SKIPME', 'yes']);
        await sleep(100);
        await until(async () => {
            try {
                return (await storage.get('ready', 1)) === true;
            } catch {
                return false;
            }
        }, 'reconnect');
        await control.flushDb(); // Only this isolated, ephemeral Redis instance.
        await Promise.all(Array.from({ length: 100 }, request));
        assert.equal(originCalls, 2, 'post-invalidation burst must share one refetch');
        await sleep(50);

        server.kill('SIGSTOP');
        const unavailableStart = performance.now();
        await Promise.all(
            Array.from({ length: 100 }, () =>
                ContentDelivery.createClient(sdk, 'outage-room', undefined, {
                    cache: { storage, scope: 'local-test', latestVersion: 1 },
                }).newsroom(),
            ),
        );
        assert.equal(originCalls, 3, 'stalled-cache fallback burst must share one origin fetch');
        assert(performance.now() - unavailableStart < 2000);
        console.log(
            'PASS: cold 100 -> 1 origin; warm 100 -> 0; 300 stalled Redis commands settle within 2s; reconnect; invalidation 100 -> 1; stalled-cache fallback 100 -> 1.',
        );
    } finally {
        server.kill('SIGCONT');
        if (control.isOpen) await control.disconnect();
        server.kill('SIGTERM');
        await once(server, 'exit');
        console.error = originalConsoleError;
    }
}
main().then(
    () => process.exit(0),
    (error) => {
        console.error(error);
        process.exit(1);
    },
);
