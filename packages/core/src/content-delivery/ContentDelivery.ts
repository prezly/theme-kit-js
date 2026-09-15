import type {
    Culture,
    Newsroom,
    NewsroomTheme,
    PrezlyClient,
    Query,
    TranslatedCategory,
} from '@prezly/sdk';
import { ApiError, Category, NewsroomGallery, SortOrder, Stories, Story } from '@prezly/sdk';

import type { Cache, UnixTimestampInSeconds } from './cache';
import { RequestCoalescer, sharedContentRequests } from './RequestCoalescer';
import {
    CONTENT_OPERATIONS,
    type ContentOperation,
    type CacheLayer,
    type Telemetry,
    emit,
    elapsedSeconds,
    telemetryNow,
} from './telemetry';

export interface Options {
    formats?: Story.FormatVersion[];
    telemetry?: Telemetry;
    cache?: {
        storage: Cache;
        latestVersion: UnixTimestampInSeconds;
        /** Stable source/authorization identity. Enables cross-client request sharing. */
        scope?: string;
        /**
         * Retention in seconds for `null` results, i.e. content the API reported as
         * not found, gone or forbidden. Defaults to `DEFAULT_NEGATIVE_TTL`.
         * A cache version change still invalidates them immediately.
         */
        negativeTtl?: number;
    };
}

/**
 * Not-found results are cached only briefly: long enough to absorb repeated
 * requests for the same missing slug, short enough that a story published
 * without a cache version change appears within a minute.
 */
export const DEFAULT_NEGATIVE_TTL = 60;

export namespace stories {
    export interface SearchParams {
        search?: string;
        categories?: Pick<Category, 'id'>[];
        tags?: string[];
        locale?: Pick<Culture, 'code'> | Culture.Code;
        limit: number;
        offset?: number;
        highlighted?: number;
        query?: Query;
    }

    export interface IncludeOptions<Include extends keyof Story.ExtraFields> {
        include?: Include[];
    }
}

export namespace allStories {
    export interface SearchParams {
        search?: string;
        categories?: Pick<Category, 'id'>[];
        locale?: Pick<Culture, 'code'>;
    }

    export interface IncludeOptions<Include extends keyof Story.ExtraFields> {
        include?: Include[];
    }
}

export namespace story {
    export type SearchParams =
        | { uuid: Story['uuid']; slug?: never }
        | { uuid?: never; slug: Story['slug'] };

    export interface IncludeOptions<Include extends keyof Story.ExtraFields> {
        include?: Include[];
    }
}

export namespace galleries {
    export interface SearchParams {
        offset?: number;
        limit?: number;
        type?: `${NewsroomGallery.Type}`;
    }
}

export type Client = ReturnType<typeof createClient>;

/**
 * Sort order to list stories chronologically, with pinned stories on top.
 */
const CHRONOLOGICALLY: SortOrder = SortOrder.combine(
    SortOrder.desc('is_pinned'),
    SortOrder.desc('published_at'),
);

/**
 * Do not cache these methods, as they are derivatives of other cached methods.
 */
const UNCACHED_METHODS: (keyof Client)[] = [
    'themeSettings',
    'language',
    'usedLanguages',
    'locales',
    'defaultLanguage',
    'defaultLocale',
    'languageOrDefault',
    'companyInformation',
    'notifications',
    'category',
    'translatedCategory',
    'translatedCategories',
];

export function createClient(
    prezly: PrezlyClient,
    newsroomUuid: Newsroom['uuid'],
    newsroomThemeUuid: NewsroomTheme['id'] | undefined,
    { formats = [Story.FormatVersion.SLATEJS_V4], cache, telemetry }: Options = {},
) {
    const client = {
        newsroom() {
            return prezly.newsrooms.get(newsroomUuid);
        },

        theme() {
            return newsroomThemeUuid
                ? prezly.newsroomThemes.get(newsroomUuid, newsroomThemeUuid)
                : undefined;
        },

        async themeSettings() {
            const theme = await client.theme();
            return theme?.settings;
        },

        languages() {
            return prezly.newsroomLanguages.list(newsroomUuid).then((data) => data.languages);
        },

        async usedLanguages() {
            const languages = await client.languages();
            return languages.filter((lang) => lang.public_stories_count > 0);
        },

        async locales() {
            const languages = await client.languages();
            return languages.map((lang) => lang.code);
        },

        async defaultLanguage() {
            const languages = await client.languages();

            const defaultLanguage = languages.find((lang) => lang.is_default);
            if (!defaultLanguage) {
                throw new Error(
                    'A newsroom is expected to always have a default language. Something is wrong.',
                );
            }

            return defaultLanguage;
        },

        async companyInformation(code?: Culture['code']) {
            const languageSettings = code
                ? await client.languageOrDefault(code)
                : await client.defaultLanguage();

            return languageSettings.company_information;
        },

        async notifications(locale: Culture['code']) {
            const languageSettings = await client.languageOrDefault(locale);
            return languageSettings.notifications;
        },

        async defaultLocale() {
            const defaultLanguage = await client.defaultLanguage();
            return defaultLanguage.code;
        },

        async language(code: Culture['code']) {
            const languages = await client.languages();

            return languages.find(
                (lang) => (!code && lang.is_default) || lang.locale.code === code,
            );
        },

        async languageOrDefault(code: Culture['code']) {
            return (await client.language(code)) ?? (await client.defaultLanguage());
        },

        categories() {
            return prezly.newsroomCategories.list(newsroomUuid, { sortOrder: '+order' });
        },

        async category(arg: Category['id'] | Category.Translation['slug']) {
            const categories = await client.categories();

            if (typeof arg === 'number') {
                return categories.find((category) => category.id === arg);
            }

            return categories.find((category) =>
                Category.translations(category).some((translation) => translation.slug === arg),
            );
        },

        async translatedCategories(
            locale: Culture['code'],
            categories?: Category[],
        ): Promise<TranslatedCategory[]> {
            return Category.translations(categories ?? (await client.categories()), locale);
        },

        async translatedCategory(locale: Culture['code'], slug: Category.Translation['slug']) {
            const translations = await client.translatedCategories(locale);
            return translations.find((category) => category.slug === slug);
        },

        featuredContacts() {
            return prezly.newsroomContacts.search(newsroomUuid, {
                query: {
                    is_featured: true,
                },
            });
        },

        galleries(params: galleries.SearchParams = {}) {
            const { offset, limit, type } = params;
            return prezly.newsroomGalleries.search(newsroomUuid, {
                limit,
                offset,
                scope: {
                    status: NewsroomGallery.Status.PUBLIC,
                    is_empty: false,
                    type,
                },
            });
        },

        async gallery(uuid: NewsroomGallery['uuid']) {
            try {
                return await prezly.newsroomGalleries.get(newsroomUuid, uuid);
            } catch (error) {
                if (error instanceof ApiError && isNotAvailableError(error)) {
                    return null;
                }
                throw error;
            }
        },

        stories<Include extends keyof Story.ExtraFields = never>(
            params: stories.SearchParams,
            options: stories.IncludeOptions<Include> = {},
        ) {
            const {
                search,
                query,
                offset = 0,
                limit,
                categories,
                locale,
                highlighted = 0,
                tags,
            } = params;
            const { include = [] } = options;

            const localeCode = locale && typeof locale === 'object' ? locale.code : locale;

            return prezly.stories.search({
                sortOrder: CHRONOLOGICALLY,
                formats,
                limit: offset === 0 ? limit + highlighted : limit,
                offset: offset > 0 ? offset + highlighted : offset,
                search,
                query: mergeQueries(query, {
                    'category.id': categories?.length
                        ? { $all: categories.map(({ id }) => id) }
                        : undefined,
                    'newsroom.uuid': { $in: [newsroomUuid] },
                    locale: localeCode ? { $in: [localeCode] } : undefined,
                    status: { $in: [Story.Status.PUBLISHED] },
                    visibility: { $in: [Story.Visibility.PUBLIC] },
                    'tag.name': tags?.length ? { $any: tags } : undefined,
                }),
                include,
            });
        },

        async allStories<Include extends keyof Story.ExtraFields = never>(
            params: allStories.SearchParams = {},
            options: allStories.IncludeOptions<Include> = {},
        ) {
            const { include = [] } = options;

            const newsroom = await client.newsroom();

            const chunkSize = 200;

            // Note: This is a counter of ALL stories, public, private, or drafts.
            //       Depending on the specific newsroom data, the rate of overfetching may be significant.
            const maxStories = newsroom.stories_number;

            const pages = Math.ceil(maxStories / chunkSize);

            // Bound production as well as transport admission: a large newsroom
            // must not enqueue every page and overflow the shared HTTP queue itself.
            const pagesPerBatch = 8;
            const responses: Awaited<ReturnType<typeof client.stories<Include>>>[] = [];
            for (let firstPage = 0; firstPage < pages; firstPage += pagesPerBatch) {
                const batch = await Promise.all(
                    Array.from({ length: Math.min(pagesPerBatch, pages - firstPage) }, (_, index) =>
                        client.stories<Include>(
                            {
                                ...params,
                                limit: chunkSize,
                                offset: (firstPage + index) * chunkSize,
                            },
                            { include },
                        ),
                    ),
                );
                responses.push(...batch);
            }

            return responses.flatMap((response) => response.stories);
        },

        async story<Include extends keyof Story.ExtraFields = never>(
            params: story.SearchParams,
            options: story.IncludeOptions<Include> = {},
        ) {
            const { include = [] } = options;

            if (params.uuid) {
                try {
                    return await prezly.stories.get(params.uuid, {
                        formats,
                        include: [...Stories.EXTENDED_STORY_INCLUDED_EXTRA_FIELDS, ...include],
                    });
                } catch (error) {
                    if (error instanceof ApiError && isNotAvailableError(error)) {
                        return null;
                    }

                    throw error;
                }
            }

            try {
                return await prezly.stories.getBySlug(params.slug!, {
                    formats,
                    query: {
                        'newsroom.uuid': { $in: [newsroomUuid] },
                        status: {
                            $in: [Story.Status.PUBLISHED, Story.Status.EMBARGO],
                        },
                        visibility: {
                            $in: [
                                Story.Visibility.PUBLIC,
                                Story.Visibility.PRIVATE,
                                Story.Visibility.EMBARGO,
                            ],
                        },
                    },
                    include: [...Stories.EXTENDED_STORY_INCLUDED_EXTRA_FIELDS, ...include],
                });
            } catch (error) {
                if (error instanceof ApiError && isNotAvailableError(error)) {
                    return null;
                }

                throw error;
            }
        },
    };

    if (cache) {
        if (cache.scope !== undefined && !cache.scope) {
            throw new Error('Content cache scope must not be empty.');
        }
        const namespace = `${newsroomUuid}:${newsroomThemeUuid}:${formats.join(',')}:`;
        // A single schema prefix keeps old readers away from scoped envelopes.
        // Scope/version changes overwrite the same keys rather than adding namespaces.
        const storage =
            cache.scope === undefined ? cache.storage : cache.storage.namespace('scoped-v1');
        injectCache(
            client,
            storage.namespace(namespace),
            cache.latestVersion,
            cache.scope,
            namespace,
            UNCACHED_METHODS,
            telemetry,
            cache.negativeTtl ?? DEFAULT_NEGATIVE_TTL,
        );
    } else if (telemetry) {
        for (const methodName of Object.keys(client) as (keyof Client)[]) {
            if (UNCACHED_METHODS.includes(methodName)) continue;
            const invoke = client[methodName].bind(client);
            const operation = contentOperation(methodName);
            client[methodName] = ((...args: unknown[]) => {
                emit(telemetry, { type: 'content_request', operation });
                return observeOrigin(() => (invoke as Function)(...args), telemetry, operation);
            }) as any;
        }
    }

    return client;
}

type ScopedCacheValue = { scope: string; value: any };

function injectCache(
    client: Client,
    cache: Cache,
    latestVersion: UnixTimestampInSeconds,
    scope: string | undefined,
    namespace: string,
    uncachedMethods: (keyof Client)[] = [],
    telemetry?: Telemetry,
    negativeTtl: number = DEFAULT_NEGATIVE_TTL,
) {
    if (!Number.isFinite(negativeTtl) || negativeTtl <= 0) {
        throw new RangeError('The negative cache TTL must be a positive number of seconds.');
    }
    // An opaque SDK client does not expose its credentials/source. Callers without
    // an explicit scope keep request-local sharing; the Next.js adapter supplies one.
    const requests = scope === undefined ? new RequestCoalescer() : sharedContentRequests;
    const methodNames = Object.keys(client) as (keyof Client)[];

    methodNames.forEach((methodName) => {
        if (uncachedMethods.includes(methodName)) return;
        const uncachedFn = client[methodName].bind(client);
        const operation = contentOperation(methodName);

        client[methodName] = async (...args: Parameters<typeof uncachedFn>) => {
            emit(telemetry, { type: 'content_request', operation });
            // Preserve existing argument serialization; query canonicalization is separate.
            const cacheKey = `${methodName}:${JSON.stringify(args)}`;
            const dedupeKey = JSON.stringify([scope, namespace, latestVersion, cacheKey]);
            return requests.run(
                dedupeKey,
                async () => {
                    try {
                        let layer: CacheLayer = 'custom';
                        const stored = telemetry
                            ? await cache.get<any>(cacheKey, latestVersion, (source) => {
                                  layer =
                                      source === 'memory' || source === 'redis' ? source : 'custom';
                              })
                            : await cache.get<any>(cacheKey, latestVersion);
                        const cached =
                            scope === undefined
                                ? stored
                                : (stored as ScopedCacheValue | undefined)?.scope === scope
                                  ? stored.value
                                  : undefined;
                        // Only an absent entry is a miss. A stored `null` (not found),
                        // `false` or `0` is a valid result and must not reach the origin.
                        if (cached !== undefined) {
                            emit(telemetry, { type: 'cache_hit', operation, layer });
                            return { value: cached };
                        }
                    } catch {
                        emit(telemetry, { type: 'cache_error', operation, action: 'read' });
                        // A cache failure must not prevent a bounded origin fallback.
                    }

                    emit(telemetry, { type: 'cache_miss', operation });
                    const value = await observeOrigin(
                        () => (uncachedFn as Function)(...args),
                        telemetry,
                        operation,
                    );
                    const stored = scope === undefined ? value : { scope, value };
                    // `null` means the API answered 403/404/410 for this lookup. Keep it
                    // only briefly. Errors (401, 429, 5xx, transport) throw above and are
                    // never stored. `undefined` results are not stored either.
                    const options = value === null ? { ttl: negativeTtl } : undefined;
                    // Observe synchronous and asynchronous write failures without holding
                    // up a successful response or leaving an unhandled rejection.
                    const cacheWrite =
                        value === undefined
                            ? undefined
                            : Promise.resolve()
                                  .then(() => cache.set(cacheKey, stored, latestVersion, options))
                                  .catch(() => {
                                      emit(telemetry, {
                                          type: 'cache_error',
                                          operation,
                                          action: 'write',
                                      });
                                  });
                    return { value, cacheWrite };
                },
                telemetry
                    ? (event) =>
                          emit(telemetry, {
                              type: event === 'coalesced' ? 'coalesced' : 'content_rejected',
                              operation,
                          })
                    : undefined,
            );
        };
    });
}

function contentOperation(name: string): ContentOperation {
    return CONTENT_OPERATIONS.includes(name as ContentOperation)
        ? (name as ContentOperation)
        : 'other';
}

function observeOrigin(
    invoke: () => any,
    telemetry: Telemetry | undefined,
    operation: ContentOperation,
): any {
    if (!telemetry) return invoke();
    const start = telemetryNow();
    const complete = (outcome: 'success' | 'error') =>
        emit(telemetry, { type: 'origin', operation, outcome, seconds: elapsedSeconds(start) });
    try {
        const value = invoke();
        if (value && typeof value.then === 'function') {
            return Promise.resolve(value).then(
                (result) => {
                    complete('success');
                    return result;
                },
                (error) => {
                    complete('error');
                    throw error;
                },
            );
        }
        complete('success');
        return value;
    } catch (error) {
        complete('error');
        throw error;
    }
}

function mergeQueries(...queries: (Query | undefined)[]): Query | undefined {
    const queryObjects = queries
        .filter((query) => Boolean(query))
        .map((query): object | undefined => {
            if (typeof query === 'string') {
                return JSON.parse(query);
            }
            return query;
        })
        .filter((query): query is object => Boolean(query))
        .filter((query) => Object.keys(query).length > 0);

    if (queryObjects.length === 0) {
        return undefined;
    }

    if (queryObjects.length === 1) {
        return queryObjects[0];
    }

    return { $and: queryObjects };
}

const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_FORBIDDEN = 403;
const ERROR_CODE_GONE = 410;

function isNotAvailableError(error: ApiError) {
    return (
        error.status === ERROR_CODE_NOT_FOUND ||
        error.status === ERROR_CODE_GONE ||
        error.status === ERROR_CODE_FORBIDDEN
    );
}
