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
}

export function createClient(
    prezly: PrezlyClient,
    newsroomUuid: Newsroom['uuid'],
    newsroomThemeUuid: NewsroomTheme['id'] | undefined,
    { formats = [Story.FormatVersion.SLATEJS_V4], pinning = false }: Options = {},
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

        async category(id: Category['id']) {
            const categories = await client.categories();
            return categories.find((category) => category.id === id);
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

        galleries(
            params: { offset?: number; limit?: number; type?: `${NewsroomGallery.Type}` } = {},
        ) {
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

        stories(params: {
            search?: string;
            category?: Pick<Category, 'id'>;
            locale?: Pick<Culture, 'code'>;
            limit?: number;
            offset?: number;
        }) {
            const { search, offset, limit, category, locale } = params;
            return prezly.stories.search({
                sortOrder: chronologically(SortOrder.Direction.DESC, pinning),
                formats,
                limit,
                offset,
                search,
                query: {
                    [`category.id`]: category ? { $any: [category.id] } : undefined,
                    [`newsroom.uuid`]: { $in: [newsroomUuid] },
                    [`locale`]: locale ? { $in: [locale.code] } : undefined,
                    [`status`]: { $in: [Story.Status.PUBLISHED] },
                    [`visibility`]: { $in: [Story.Visibility.PUBLIC] },
                },
                include: ['thumbnail_image'],
            });
        },

        async allStories(
            params: {
                search?: string;
                category?: Pick<Category, 'id'>;
                locale?: Pick<Culture, 'code'>;
            } = {},
        ): Promise<Story[]> {
            const newsroom = await client.newsroom();

            const chunkSize = 200;

            // Note: This is a counter of ALL stories, public, private, or drafts.
            //       Depending on the specific newsroom data, the rate of overfetching may be significant.
            const maxStories = newsroom.stories_number;

            const pages = Math.ceil(maxStories / chunkSize);

            const promises = Array.from({ length: pages }, (_, chunkIndex) =>
                client.stories({
                    ...params,
                    limit: chunkSize,
                    offset: chunkIndex * chunkSize,
                }),
            );

            return (await Promise.all(promises)).flatMap((response) => response.stories);
        },

        async story(
            params: { uuid: Story['uuid']; slug?: never } | { uuid?: never; slug: Story['slug'] },
        ) {
            if (params.uuid) {
                try {
                    return await prezly.stories.get(params.uuid, {
                        formats,
                        include: Stories.EXTENDED_STORY_INCLUDED_EXTRA_FIELDS,
                    });
                } catch (error) {
                    if (error instanceof ApiError && isNotAvailableError(error)) {
                        return null;
                    }

                    throw error;
                }
            }

            const { stories } = await prezly.stories.search({
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
                include: Stories.EXTENDED_STORY_INCLUDED_EXTRA_FIELDS,
            });

            return stories[0] ?? null;
        },
    };

    return client;
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
