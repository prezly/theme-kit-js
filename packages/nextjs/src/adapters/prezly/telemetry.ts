import { ContentDelivery } from '@prezly/theme-kit-core';

export function upstreamRoute(input: Parameters<typeof fetch>[0]): ContentDelivery.UpstreamRoute {
    try {
        const path = new URL(
            typeof input === 'string' ? input : input instanceof URL ? input.href : input.url,
        ).pathname;
        if (/^\/v2\/stories\/by-slug\/[^/]+$/.test(path)) return 'story_by_slug';
        if (/^\/v2\/stories(?:\/search)?$/.test(path)) return 'stories';
        if (/^\/v2\/stories\/[^/]+$/.test(path)) return 'story';
        if (/^\/v2\/newsrooms\/[^/]+\/themes\/[^/]+$/.test(path)) return 'theme';
        if (/^\/v2\/newsrooms\/[^/]+\/languages(?:\/[^/]+)?$/.test(path)) return 'languages';
        if (/^\/v2\/newsrooms\/[^/]+\/categories(?:\/[^/]+)?$/.test(path)) return 'categories';
        if (/^\/v2\/newsrooms\/[^/]+\/contacts(?:\/search)?$/.test(path)) return 'contacts';
        if (/^\/v2\/newsrooms\/[^/]+\/galleries(?:\/search)?$/.test(path)) return 'galleries';
        if (/^\/v2\/newsrooms\/[^/]+\/galleries\/[^/]+$/.test(path)) return 'gallery';
        if (/^\/v2\/newsrooms\/[^/]+$/.test(path)) return 'newsroom';
    } catch {
        // Invalid/custom inputs keep their original fetch behavior.
    }
    return 'other';
}

/** Observe response headers only; preserve the Response and streaming body. */
export function createObservedFetch(
    fetchImpl: typeof fetch,
    telemetry: ContentDelivery.Telemetry | undefined,
    client: 'raw' | 'content',
): typeof fetch {
    if (!telemetry) return fetchImpl;
    return async (input, init) => {
        const route = upstreamRoute(input);
        const start = ContentDelivery.telemetryNow();
        let status: '2xx' | '3xx' | '4xx' | '5xx' | 'other' | 'error' = 'error';
        try {
            const response = await fetchImpl(input, init);
            status =
                response.status >= 200 && response.status < 600
                    ? (`${Math.floor(response.status / 100)}xx` as typeof status)
                    : 'other';
            return response;
        } finally {
            ContentDelivery.emit(telemetry, {
                type: 'upstream',
                route,
                client,
                status,
                seconds: ContentDelivery.elapsedSeconds(start),
            });
        }
    };
}
