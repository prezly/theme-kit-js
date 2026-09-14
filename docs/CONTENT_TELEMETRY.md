# Content telemetry (DEV-24148)

Telemetry is opt-in and does not create a socket, timer, delivery queue or Redis key. The existing request/coalescing limits, content-cache keys, source validation, null handling and expiry policy are unchanged. Observer exceptions and rejected promises are ignored without changing application results.

## Connect one collector per runtime

```ts
import { ContentDelivery } from '@prezly/theme-kit-nextjs';
import { PrezlyAdapter } from '@prezly/theme-kit-nextjs/server';

const metrics = ContentDelivery.getMetricsCollector('node');
const adapter = PrezlyAdapter.connect(
    { accessToken, newsroom, baseUrl },
    {
        cache: { memory: true, redis: { url: redisUrl }, latestVersion },
        telemetry: metrics.observe,
    },
);
```

`getMetricsCollector` shares a collector across ESM/CJS copies and chunks in the same JS realm. Pass the same observer to all adapters that should contribute. `createMetricsCollector` makes an isolated collector for tests or an explicitly separate serving context. Its `render()` returns Prometheus text and `contentType` supplies the response content type.

The raw SDK client is observed too, but its Response/body and transport semantics remain unchanged: it does not acquire the content client's buffering, queue or deadline. `client="content"` identifies the bounded content transport, while `client="raw"` identifies the ordinary SDK transport.

A core-only caller can pass `telemetry: { observe: metrics.observe, source: 'prezly' }` in `ContentDelivery.createClient` options. Without it, the client is not observed. The Next.js adapter derives the fixed source bucket `prezly` or `custom`; core callers default to `unknown`. All labels come from fixed allowlists. Tokens, URLs, request arguments, newsroom/theme IDs, cache keys, error messages and response values are not emitted.

## Metric meanings

All metrics use the `theme_kit_` prefix. Runtime labels are restricted to `node`, `edge` and `unknown`; source labels to `prezly`, `custom` and `unknown`.

| Metric | Meaning |
| --- | --- |
| `content_requests_total` | Invocations of the cacheable ContentDelivery operations, including followers. Derived helper methods are not separately counted. |
| `content_cache_hits_total` | Values accepted after version/source-scope validation and the existing truthiness check. `layer` is memory, Redis or custom. |
| `content_cache_misses_total` | Lookups that require fallback, including stale/mismatched/null values and cache-read failures. |
| `content_cache_errors_total` | Read/write failures. A successful response does not wait for telemetry or cache writes. |
| `content_coalesced_total` | Calls joining an existing pending result, including the bounded post-result write window. |
| `content_rejected_total` | New keys rejected by the pending-content limit. |
| `content_origin_total`, `content_origin_duration_seconds` | Uncached method executions and their duration/outcome. Success means the method resolved, including valid null results. Aggregate methods can call other methods; do not sum these as physical API requests. |
| `upstream_requests_total` | Actual fetch attempts reaching headers or transport failure, classified by fixed route, source, transport client and status class. |
| `upstream_headers_duration_seconds` | Time to headers or transport failure, excluding body consumption and queue wait. A 2xx header does not prove the later body/SDK decode succeeded. |
| `fetch_queue_events_total`, `fetch_queue_wait_seconds` | Queued/admitted/rejected/canceled work and completed queue waits. Immediate admission has zero wait. |
| `fetch_timeouts_total` | Content-transport deadlines, including stalled bodies after successful headers. |
| `redis_command_attempts_total`, `redis_command_duration_seconds` | Application-visible Redis command attempts/outcomes, including command deadlines. A late underlying reply can arrive after an observed timeout. |
| `redis_unavailable_total` | Operations skipped while the shared connection is not ready, not commands sent to Redis. |

Memory/Redis source reporting is carried through an optional third argument to `Cache.get`. Existing custom caches remain compatible and are reported as `custom` unless they report a layer. A returned candidate is not counted as a hit until ContentDelivery accepts its scope/version/value. Metrics do not implement the separate null-cache or cache-promotion fixes.

The collector initializes aggregate families with zero-valued `other` series, then initializes all outcomes for observed operation/route combinations. This makes installed-idle aggregate counters available without retaining events or creating labels from data. A zero command count does not prove Redis is configured/healthy. A never-observed specific operation may be absent. Counter resets indicate a runtime/collector restart; use `rate`/`increase`, not raw counter subtraction.

## Serving and rollout

Publish the Theme Kit release first, then adopt it in Bea and attach the observer. For Kubernetes, expose the Node collector on a dedicated internal metrics port/Service with a selected ServiceMonitor, not a public newsroom API route. Exporter failure must not affect page readiness or request handling. The collector itself does not start or expose that endpoint.

Next.js middleware runs in a separate Edge realm. A Node exporter cannot read its counters merely because both use this library. Edge metrics need their own verified collection path; do not claim Node metrics cover middleware. Keep package versions aligned and verify the actual runtime/build and enabled adapter coverage before comparing runs. Uninstrumented clients/older code are not inferred from observed counts.

These hooks and the collector are the package prerequisite for Bea exporter wiring, dashboard/alerts and the full benchmark. They do not deploy those components. API SQL/CPU work is measured by the separate server-side telemetry change; HTTP/cache events do not infer database counts.

## Example queries after exporter adoption

Use the actual scrape labels. For a shared Bea deployment these are shared-workload observations, not attribution to one benchmark URL.

```promql
sum(increase(theme_kit_content_cache_hits_total{runtime="node",layer="memory"}[5m]))
sum(increase(theme_kit_content_cache_hits_total{runtime="node",layer="redis"}[5m]))
sum(increase(theme_kit_content_coalesced_total{runtime="node"}[5m]))
sum(increase(theme_kit_upstream_requests_total{runtime="node",client="content"}[5m]))
sum(increase(theme_kit_fetch_queue_events_total{runtime="node",outcome=~"full|wait_timeout"}[5m]))
histogram_quantile(0.95, sum by (le) (rate(theme_kit_content_origin_duration_seconds_bucket{runtime="node",operation="story"}[5m])))
```

Use an origin-duration histogram for full SDK/content work, and the headers histogram only for headers latency. Keep warm/cold conditions and sampling windows comparable. See [Prometheus instrumentation guidance](https://prometheus.io/docs/practices/instrumentation/).
