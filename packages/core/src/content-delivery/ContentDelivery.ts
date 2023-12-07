/* eslint-disable @typescript-eslint/no-use-before-define */
import type {
    Culture,
    Newsroom,
    NewsroomTheme,
    PrezlyClient,
    TranslatedCategory,
} from '@prezly/sdk';
import { ApiError, Category, NewsroomGallery, SortOrder, Stories, Story } from '@prezly/sdk';

export interface Options {
    formats?: Story.FormatVersion[];
    pinning?: boolean;
    cache?: boolean;
}

export namespace stories {
    export interface SearchParams {
        search?: string;
        category?: Pick<Category, 'id'>;
        locale?: Pick<Culture, 'code'>;
        limit: number;
        offset?: number;
        highlighted?: number;
    }

    export interface IncludeOptions<Include extends keyof Story.ExtraFields> {
        include?: Include[];
    }
}

export namespace allStories {
    export interface SearchParams {
        search?: string;
        category?: Pick<Category, 'id'>;
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

    // eslint-disable-next-line @typescript-eslint/no-shadow
    export interface IncludeOptions<Include extends keyof Story.ExtraFields> {
        include?: Include[];
    }
}

export namespace mediaAlbums {
    export interface SearchParams {
        offset?: number;
        limit?: number;
        type?: `${NewsroomGallery.Type}`;
    }
}

export type Client = ReturnType<typeof createClient>;

export function createClient(
    prezly: PrezlyClient,
    newsroomUuid: Newsroom['uuid'],
    newsroomThemeUuid: NewsroomTheme['id'] | undefined,
    { formats = [Story.FormatVersion.SLATEJS_V4], pinning = false, cache = false }: Options = {},
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

        mediaAlbums(params: mediaAlbums.SearchParams = {}) {
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

        async mediaAlbum(uuid: NewsroomGallery['uuid']) {
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
            const { search, offset = 0, limit, category, locale, highlighted = 0 } = params;
            const { include = [] } = options;
            return prezly.stories.search({
                sortOrder: chronologically(SortOrder.Direction.DESC, pinning),
                formats,
                limit: offset === 0 ? limit + highlighted : limit,
                offset: offset > 0 ? offset + highlighted : offset,
                search,
                query: {
                    [`category.id`]: category ? { $any: [category.id] } : undefined,
                    [`newsroom.uuid`]: { $in: [newsroomUuid] },
                    [`locale`]: locale ? { $in: [locale.code] } : undefined,
                    [`status`]: { $in: [Story.Status.PUBLISHED] },
                    [`visibility`]: { $in: [Story.Visibility.PUBLIC] },
                },
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

            const { stories: data } = await prezly.stories.search({
                formats,
                limit: 1,
                query: {
                    [`slug`]: params.slug,
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

            return data[0] ?? null;
        },
    };

    if (cache) {
        injectCache(client);
    }

    return client;
}

function injectCache(client: Client) {
    const cachedCalls = new Map<string, any>();

    const methodNames = Object.keys(client) as (keyof Client)[];

    methodNames.forEach((methodName) => {
        const uncachedFn = client[methodName].bind(client);

        // eslint-disable-next-line no-param-reassign
        client[methodName] = (...args: Parameters<typeof uncachedFn>) => {
            const key = `${methodName}:${JSON.stringify(args)}`;

            const cached = cachedCalls.get(key);
            if (cached) return cached;

            const value = (uncachedFn as Function)(...args);
            cachedCalls.set(key, value);

            return value;
        };
    });
}

function chronologically(direction: `${SortOrder.Direction}`, pinning = false) {
    const pinnedFirst = SortOrder.desc('is_pinned');
    const chronological =
        direction === SortOrder.Direction.ASC
            ? SortOrder.asc('published_at')
            : SortOrder.desc('published_at');

    return pinning ? SortOrder.combine(pinnedFirst, chronological) : chronological;
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
