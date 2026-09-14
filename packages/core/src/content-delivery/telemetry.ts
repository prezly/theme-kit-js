export const CONTENT_OPERATIONS = [
    'newsroom',
    'theme',
    'languages',
    'categories',
    'featuredContacts',
    'galleries',
    'gallery',
    'stories',
    'allStories',
    'story',
    'other',
] as const;

export type ContentOperation = (typeof CONTENT_OPERATIONS)[number];
export type CacheLayer = 'memory' | 'redis' | 'custom';
export type TelemetrySource = 'prezly' | 'custom' | 'unknown';
export const UPSTREAM_ROUTES = [
    'newsroom',
    'theme',
    'languages',
    'categories',
    'contacts',
    'galleries',
    'gallery',
    'stories',
    'story',
    'story_by_slug',
    'other',
] as const;
export type UpstreamRoute = (typeof UPSTREAM_ROUTES)[number];

type ContentEvent = { operation: ContentOperation } & (
    | { type: 'content_request' | 'cache_miss' | 'coalesced' | 'content_rejected' }
    | { type: 'cache_hit'; layer: CacheLayer }
    | { type: 'cache_error'; action: 'read' | 'write' }
    | { type: 'origin'; outcome: 'success' | 'error'; seconds: number }
);
type UpstreamEvent = { route: UpstreamRoute } & (
    | {
          type: 'upstream';
          client: 'raw' | 'content';
          status: '2xx' | '3xx' | '4xx' | '5xx' | 'other' | 'error';
          seconds: number;
      }
    | {
          type: 'fetch_queue';
          outcome: 'queued' | 'accepted' | 'full' | 'wait_timeout' | 'aborted';
          seconds?: number;
      }
    | { type: 'fetch_timeout' }
);
type RedisEvent = { command: 'get' | 'set' | 'expire' } & (
    | { type: 'redis_command'; outcome: 'success' | 'error'; seconds: number }
    | { type: 'redis_unavailable' }
);

/** Only bounded classifications and numeric observations; never payloads or keys. */
export type TelemetryEvent = (ContentEvent | UpstreamEvent | RedisEvent) & {
    source: TelemetrySource;
};
export type TelemetryObserver = (event: TelemetryEvent) => unknown;
export interface Telemetry {
    observe: TelemetryObserver;
    source?: TelemetrySource;
}

export function notify<T>(observer: ((event: T) => unknown) | undefined, event: T): void {
    try {
        const result = observer?.(event);
        // TypeScript permits async callbacks where a void callback is expected.
        // Observe a rejection without awaiting or retaining a metrics queue.
        if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
            void Promise.resolve(result).catch(() => undefined);
        }
    } catch {
        // Instrumentation must not change the application's result.
    }
}

export function emit(
    telemetry: Telemetry | undefined,
    event: ContentEvent | UpstreamEvent | RedisEvent,
): void {
    if (telemetry) {
        try {
            const candidate = telemetry.source;
            const source = candidate === 'prezly' || candidate === 'custom' ? candidate : 'unknown';
            notify(telemetry.observe, { ...event, source });
        } catch {
            // A malformed observer configuration must also remain non-fatal.
        }
    }
}

export function telemetryNow(): number {
    return globalThis.performance?.now() ?? Date.now();
}

export function elapsedSeconds(start: number): number {
    return Math.max(0, (telemetryNow() - start) / 1000);
}
