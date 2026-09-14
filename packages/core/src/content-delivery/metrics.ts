import {
    CONTENT_OPERATIONS,
    UPSTREAM_ROUTES,
    type TelemetryEvent,
    type TelemetryObserver,
} from './telemetry';

const BUCKETS = [
    0.001,
    0.005,
    0.01,
    0.025,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2.5,
    5,
    10,
    30,
    Number.POSITIVE_INFINITY,
];
type Labels = Record<string, string>;
type Sample = { labels: Labels; count: number; sum: number; buckets: number[] };

function choice(value: unknown, values: readonly string[], fallback: string): string {
    return typeof value === 'string' && values.includes(value) ? value : fallback;
}

class Family {
    private readonly samples = new Map<string, Sample>();
    constructor(
        readonly name: string,
        readonly help: string,
        readonly type: 'counter' | 'histogram' = 'counter',
    ) {}
    touch(labels: Labels): Sample {
        const key = JSON.stringify(labels);
        let sample = this.samples.get(key);
        if (!sample) {
            sample = {
                labels,
                count: 0,
                sum: 0,
                buckets: this.type === 'histogram' ? BUCKETS.map(() => 0) : [],
            };
            this.samples.set(key, sample);
        }
        return sample;
    }
    add(labels: Labels, seconds?: number): void {
        const sample = this.touch(labels);
        sample.count += 1;
        if (this.type === 'histogram' && seconds !== undefined) {
            sample.sum += seconds;
            BUCKETS.forEach((bound, i) => {
                if (seconds <= bound) sample.buckets[i] += 1;
            });
        }
    }
    render(runtime: string): string[] {
        const name = `theme_kit_${this.name}`;
        const lines = [`# HELP ${name} ${this.help}`, `# TYPE ${name} ${this.type}`];
        const labels = (values: Labels) =>
            `{${Object.entries({ runtime, ...values })
                .map(([k, v]) => `${k}="${v}"`)
                .join(',')}}`;
        for (const sample of this.samples.values()) {
            if (this.type === 'counter')
                lines.push(`${name}${labels(sample.labels)} ${sample.count}`);
            else {
                BUCKETS.forEach((bound, i) => {
                    lines.push(
                        `${name}_bucket${labels({ ...sample.labels, le: bound === Number.POSITIVE_INFINITY ? '+Inf' : String(bound) })} ${sample.buckets[i]}`,
                    );
                });
                lines.push(
                    `${name}_sum${labels(sample.labels)} ${sample.sum}`,
                    `${name}_count${labels(sample.labels)} ${sample.count}`,
                );
            }
        }
        return lines;
    }
}

/**
 * One collector per serving runtime. No sockets, timers, retained events or
 * unbounded labels. Instantiate once and pass `observe` to every local adapter.
 */
export function createMetricsCollector({
    runtime = 'unknown',
}: {
    runtime?: 'node' | 'edge' | 'unknown';
} = {}) {
    const families = {
        requests: new Family(
            'content_requests_total',
            'Content method invocations, including coalesced callers.',
        ),
        hits: new Family(
            'content_cache_hits_total',
            'Cache entries accepted after version and source-scope validation.',
        ),
        misses: new Family(
            'content_cache_misses_total',
            'Cache lookups that require origin fallback.',
        ),
        cacheErrors: new Family(
            'content_cache_errors_total',
            'Observed cache read or write failures.',
        ),
        coalesced: new Family(
            'content_coalesced_total',
            'Callers joining an existing pending result.',
        ),
        rejected: new Family(
            'content_rejected_total',
            'Calls rejected by the pending-content limit.',
        ),
        origin: new Family(
            'content_origin_total',
            'Content method executions against the SDK, not physical HTTP requests.',
        ),
        originTime: new Family(
            'content_origin_duration_seconds',
            'Content origin execution duration including SDK decoding and aggregate work.',
            'histogram',
        ),
        upstream: new Family(
            'upstream_requests_total',
            'Fetch attempts that reached a response-header or transport-error outcome.',
        ),
        upstreamTime: new Family(
            'upstream_headers_duration_seconds',
            'Fetch duration to headers or transport failure; excludes body consumption.',
            'histogram',
        ),
        queue: new Family(
            'fetch_queue_events_total',
            'Bounded content transport admission and queue events.',
        ),
        queueTime: new Family(
            'fetch_queue_wait_seconds',
            'Completed admission wait; immediate admission has zero wait.',
            'histogram',
        ),
        timeouts: new Family(
            'fetch_timeouts_total',
            'Content transport deadlines, including response-body consumption.',
        ),
        redis: new Family(
            'redis_command_attempts_total',
            'Redis command attempts by application-visible outcome, including deadlines.',
        ),
        redisTime: new Family(
            'redis_command_duration_seconds',
            'Redis command duration to application-visible completion.',
            'histogram',
        ),
        redisUnavailable: new Family(
            'redis_unavailable_total',
            'Cache operations skipped because the shared Redis connection is not ready.',
        ),
    };
    const contents = new Set<string>();
    const routes = new Set<string>();
    const redis = new Set<string>();
    const contentLabels = (operation: unknown, source: string) => {
        const labels = { operation: choice(operation, CONTENT_OPERATIONS, 'other'), source };
        const key = JSON.stringify(labels);
        if (!contents.has(key)) {
            contents.add(key);
            for (const family of [
                families.requests,
                families.misses,
                families.coalesced,
                families.rejected,
                families.originTime,
            ])
                family.touch(labels);
            for (const layer of ['memory', 'redis', 'custom'])
                families.hits.touch({ ...labels, layer });
            for (const action of ['read', 'write'])
                families.cacheErrors.touch({ ...labels, action });
            for (const outcome of ['success', 'error'])
                families.origin.touch({ ...labels, outcome });
        }
        return labels;
    };
    const routeLabels = (route: unknown, source: string) => {
        const labels = { route: choice(route, UPSTREAM_ROUTES, 'other'), source };
        const key = JSON.stringify(labels);
        if (!routes.has(key)) {
            routes.add(key);
            for (const client of ['raw', 'content']) {
                families.upstreamTime.touch({ ...labels, client });
                for (const status of ['2xx', '3xx', '4xx', '5xx', 'other', 'error'])
                    families.upstream.touch({ ...labels, client, status_class: status });
            }
            for (const outcome of ['queued', 'accepted', 'full', 'wait_timeout', 'aborted'])
                families.queue.touch({ ...labels, outcome });
            families.queueTime.touch(labels);
            families.timeouts.touch(labels);
        }
        return labels;
    };
    const redisLabels = (command: unknown, source: string) => {
        const labels = { command: choice(command, ['get', 'set', 'expire'], 'get'), source };
        const key = JSON.stringify(labels);
        if (!redis.has(key)) {
            redis.add(key);
            for (const outcome of ['success', 'error'])
                families.redis.touch({ ...labels, outcome });
            families.redisTime.touch(labels);
            families.redisUnavailable.touch(labels);
        }
        return labels;
    };
    // An installed, idle collector must expose aggregate zeros, not look absent.
    // Detailed operation/route combinations are initialized on first observation.
    for (const source of ['prezly', 'custom', 'unknown']) {
        contentLabels('other', source);
        routeLabels('other', source);
        for (const command of ['get', 'set', 'expire']) redisLabels(command, source);
    }
    const observe: TelemetryObserver = (event: TelemetryEvent) => {
        if (!event || typeof event !== 'object') return;
        if (
            ['origin', 'upstream', 'redis_command'].includes(event.type) &&
            (!('seconds' in event) || typeof event.seconds !== 'number')
        )
            return;
        if (
            'seconds' in event &&
            event.seconds !== undefined &&
            (typeof event.seconds !== 'number' ||
                !Number.isFinite(event.seconds) ||
                event.seconds < 0 ||
                event.seconds > Number.MAX_SAFE_INTEGER)
        )
            return;
        const source = choice(event.source, ['prezly', 'custom', 'unknown'], 'unknown');
        if ('operation' in event) {
            const labels = contentLabels(event.operation, source);
            switch (event.type) {
                case 'content_request':
                    families.requests.add(labels);
                    break;
                case 'cache_miss':
                    families.misses.add(labels);
                    break;
                case 'cache_hit':
                    families.hits.add({
                        ...labels,
                        layer: choice(event.layer, ['memory', 'redis', 'custom'], 'custom'),
                    });
                    break;
                case 'cache_error':
                    families.cacheErrors.add({
                        ...labels,
                        action: choice(event.action, ['read', 'write'], 'read'),
                    });
                    break;
                case 'coalesced':
                    families.coalesced.add(labels);
                    break;
                case 'content_rejected':
                    families.rejected.add(labels);
                    break;
                case 'origin':
                    families.origin.add({
                        ...labels,
                        outcome: choice(event.outcome, ['success', 'error'], 'error'),
                    });
                    families.originTime.add(labels, event.seconds);
                    break;
            }
        } else if ('route' in event) {
            const labels = routeLabels(event.route, source);
            switch (event.type) {
                case 'upstream': {
                    const client = choice(event.client, ['raw', 'content'], 'raw');
                    families.upstream.add({
                        ...labels,
                        client,
                        status_class: choice(
                            event.status,
                            ['2xx', '3xx', '4xx', '5xx', 'other', 'error'],
                            'other',
                        ),
                    });
                    families.upstreamTime.add({ ...labels, client }, event.seconds);
                    break;
                }
                case 'fetch_queue':
                    families.queue.add({
                        ...labels,
                        outcome: choice(
                            event.outcome,
                            ['queued', 'accepted', 'full', 'wait_timeout', 'aborted'],
                            'aborted',
                        ),
                    });
                    if (event.seconds !== undefined) families.queueTime.add(labels, event.seconds);
                    break;
                case 'fetch_timeout':
                    families.timeouts.add(labels);
                    break;
            }
        } else if ('command' in event) {
            const labels = redisLabels(event.command, source);
            if (event.type === 'redis_unavailable') families.redisUnavailable.add(labels);
            else if (event.type === 'redis_command') {
                families.redis.add({
                    ...labels,
                    outcome: choice(event.outcome, ['success', 'error'], 'error'),
                });
                families.redisTime.add(labels, event.seconds);
            }
        }
    };
    return {
        observe,
        contentType: 'text/plain; version=0.0.4; charset=utf-8',
        render() {
            return [
                '# HELP theme_kit_metrics_info Runtime-local Theme Kit instrumentation schema.',
                '# TYPE theme_kit_metrics_info gauge',
                `theme_kit_metrics_info{runtime="${choice(runtime, ['node', 'edge', 'unknown'], 'unknown')}",schema="1"} 1`,
                ...Object.values(families).flatMap((family) =>
                    family.render(choice(runtime, ['node', 'edge', 'unknown'], 'unknown')),
                ),
                '',
            ].join('\n');
        },
    };
}

/** Share across server chunks and ESM/CJS copies within the same JS realm. */
export function getMetricsCollector(runtime: 'node' | 'edge' | 'unknown' = 'unknown') {
    const key = Symbol.for('@prezly/theme-kit-core/metrics/v1');
    const registry = globalThis as unknown as Record<
        symbol,
        Map<string, ReturnType<typeof createMetricsCollector>> | undefined
    >;
    const collectors = (registry[key] ??= new Map());
    const name = choice(runtime, ['node', 'edge', 'unknown'], 'unknown') as typeof runtime;
    let collector = collectors.get(name);
    if (!collector) {
        collector = createMetricsCollector({ runtime: name });
        collectors.set(name, collector);
    }
    return collector;
}
