import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import stableStringify from 'json-stable-stringify';

import type { Newsroom, NewsroomTheme, Story } from '@prezly/sdk';
import { createPrezlyClient } from '@prezly/sdk';
import { ContentDelivery, Resolvable } from '@prezly/theme-kit-core';

import { type Configuration as CacheConfig, configure as configureCache } from './cache';
import { createBoundedFetch } from './requests';
import { createObservedFetch } from './telemetry';

export namespace PrezlyAdapter {
    export interface Configuration {
        accessToken: string;
        newsroom: Newsroom['uuid'];
        theme?: NewsroomTheme['id'];
        baseUrl?: string;
        headers?: Record<string, string>;
        pinning?: boolean;
        formats?: Story.FormatVersion[];
    }

    export interface Options {
        cache?: CacheConfiguration;
        fetch?: typeof fetch;
        telemetry?: ContentDelivery.TelemetryObserver;
    }

    export type CacheConfiguration = CacheConfig;

    export function connect(
        config: Resolvable<Configuration>,
        { cache: cacheConfig, fetch, telemetry: observer }: Options = {},
    ) {
        function usePrezlyClient() {
            const {
                // sdk client properties
                accessToken,
                baseUrl,
                headers,
                // contentDelivery client properties
                newsroom,
                theme,
                formats,
            } = Resolvable.resolve(config);
            const telemetry: ContentDelivery.Telemetry | undefined = observer
                ? {
                      observe: observer,
                      source:
                          !baseUrl || baseUrl.replace(/\/$/, '') === 'https://api.prezly.com'
                              ? 'prezly'
                              : 'custom',
                  }
                : undefined;

            const client = createPrezlyClient({
                fetch: telemetry
                    ? createObservedFetch(fetch ?? globalThis.fetch, telemetry, 'raw')
                    : fetch,
                accessToken,
                baseUrl,
                headers,
            });

            const cache = cacheConfig
                ? configureCache({ namespace: 'content:', ...cacheConfig, telemetry })
                : undefined;
            // Custom fetches may depend on hidden request context. Preserve their
            // existing cache behavior unless the caller declares that identity.
            const scope =
                cache && (!fetch || cacheConfig?.requestScope !== undefined)
                    ? bytesToHex(
                          sha256(
                              stableStringify({
                                  baseUrl: baseUrl ?? 'https://api.prezly.com',
                                  accessToken,
                                  headers: headers ?? {},
                                  cache: {
                                      namespace: cacheConfig?.namespace ?? 'content:',
                                      memory: cacheConfig?.memory ?? false,
                                      redis: cacheConfig?.redis,
                                  },
                                  requestScope: cacheConfig?.requestScope,
                              }) as string,
                          ),
                      )
                    : undefined;
            const contentClient = cache
                ? createPrezlyClient({
                      accessToken,
                      baseUrl,
                      headers,
                      fetch: createBoundedFetch(
                          createObservedFetch(fetch ?? globalThis.fetch, telemetry, 'content'),
                          undefined,
                          telemetry,
                      ),
                  })
                : client;
            const contentDelivery = ContentDelivery.createClient(contentClient, newsroom, theme, {
                formats,
                telemetry,
                cache: cache ? { ...cache, scope } : undefined,
            });

            return { client, contentDelivery };
        }

        return { usePrezlyClient };
    }
}
