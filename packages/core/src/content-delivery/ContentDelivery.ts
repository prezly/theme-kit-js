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

export interface Options {
    formats?: Story.FormatVersion[];
    cache?: {
        storage: Cache;
        latestVersion: UnixTimestampInSeconds;
    };
}

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
    { formats = [Story.FormatVersion.SLATEJS_V4], cache }: Options = {},
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
                    [`category.id`]: categories?.length
                        ? { $all: categories.map(({ id }) => id) }
                        : undefined,
                    [`newsroom.uuid`]: { $in: [newsroomUuid] },
                    [`locale`]: localeCode ? { $in: [localeCode] } : undefined,
                    [`status`]: { $in: [Story.Status.PUBLISHED] },
                    [`visibility`]: { $in: [Story.Visibility.PUBLIC] },
                    [`tag.name`]: tags?.length ? { $any: tags } : undefined,
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

            const promises = Array.from({ length: pages }, (_, chunkIndex) =>
                client.stories<Include>(
                    {
                        ...params,
                        limit: chunkSize,
                        offset: chunkIndex * chunkSize,
                    },
                    { include },
                ),
            );

            return (await Promise.all(promises)).flatMap((response) => response.stories);
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
                        [`newsroom.uuid`]: { $in: [newsroomUuid] },
                        [`status`]: {
                            $in: [Story.Status.PUBLISHED, Story.Status.EMBARGO],
                        },
                        [`visibility`]: {
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
        injectCache(
            client,
            cache.storage.namespace(`${newsroomUuid}:${newsroomThemeUuid}:${formats.join(',')}:`),
            cache.latestVersion,
            UNCACHED_METHODS,
        );
    }

    return client;
}

function injectCache(
    client: Client,
    cache: Cache,
    latestVersion: UnixTimestampInSeconds,
    uncachedMethods: (keyof Client)[] = [],
) {
    const methodCalls = new Map<string, Promise<any>>();
    const methodNames = Object.keys(client) as (keyof Client)[];

    methodNames.forEach((methodName) => {
        if (uncachedMethods.includes(methodName)) {
            // Do not cache this method.
            return;
        }

        const uncachedFn = client[methodName].bind(client);

        client[methodName] = async (...args: Parameters<typeof uncachedFn>) => {
            const cacheKey = `${methodName}:${JSON.stringify(args)}`;
            const dedupeKey = `${latestVersion}:${cacheKey}`;

            // Dedupe requests
            const pending = methodCalls.get(dedupeKey);
            if (pending) return pending;

            async function invoke() {
                const cached = await cache.get(cacheKey, latestVersion);
                if (cached) return cached;

                const value = await (uncachedFn as Function)(...args);
                cache.set(cacheKey, value, latestVersion);

                methodCalls.delete(dedupeKey);

                return value;
            }

            const invokation = invoke();
            methodCalls.set(dedupeKey, invokation);
            return invokation;
        };
    });
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
