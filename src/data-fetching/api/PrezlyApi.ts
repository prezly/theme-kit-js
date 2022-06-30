import type {
    Category,
    ExtraStoryFields,
    Newsroom,
    NewsroomLanguageSettings,
    Story,
} from '@prezly/sdk';
import PrezlySDK from '@prezly/sdk';
import type { IncomingMessage } from 'http';

import {
    getCompanyInformation,
    getDefaultLanguage,
    getLanguageFromNextLocaleIsoCode,
    getLanguageFromStory,
    LocaleObject,
} from '../../intl';
import type { PageProps, ServerSidePageProps } from '../../types';
import { DEFAULT_PAGE_SIZE } from '../../utils';
import { getAlgoliaSettings, isSdkError, isUuid } from '../lib';

import {
    getContactsQuery,
    getGalleriesQuery,
    getSlugQuery,
    getSortByPublishedDate,
    getStoriesQuery,
} from './queries';

const CATEGORIES_SORT_ORDER = '+order';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

type SortOrder = 'desc' | 'asc';

interface GetStoriesOptions {
    page?: number;
    pageSize?: number;
    order?: SortOrder;
    include?: (keyof ExtraStoryFields)[];
    localeCode?: string;
}

interface GetGalleriesOptions {
    page?: number;
    pageSize: number;
}

export class PrezlyApi {
    private readonly sdk: PrezlySDK;

    private readonly newsroomUuid: Newsroom['uuid'];

    private readonly themeUuid: string | undefined;

    constructor(accessToken: string, newsroomUuid: Newsroom['uuid'], themeUuid?: string) {
        const baseUrl = process.env.API_BASE_URL_OVERRIDE ?? undefined;
        this.sdk = new PrezlySDK({
            accessToken,
            baseUrl,
            // This returns stories created by legacy version of the editor in a format that can be displayed by the Prezly Content Renderer.
            headers: { 'X-Convert-v1-To-v3': 'true' },
        });
        this.newsroomUuid = newsroomUuid;
        this.themeUuid = themeUuid;
    }

    async getStory(uuid: string) {
        if (!isUuid(uuid)) {
            return undefined;
        }

        try {
            return await this.sdk.stories.get(uuid);
        } catch (error) {
            if (isSdkError(error) && error.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async getNewsroom() {
        return this.sdk.newsrooms.get(this.newsroomUuid);
    }

    async getNewsroomContacts() {
        return this.sdk.newsroomContacts.search(this.newsroomUuid, {
            query: JSON.stringify(getContactsQuery()),
        });
    }

    async getNewsroomLanguages(): Promise<NewsroomLanguageSettings[]> {
        return (await this.sdk.newsroomLanguages.list(this.newsroomUuid)).languages;
    }

    /**
     * Note: this method returns ALL stories from the newsroom. It's intended to be used for sitemaps and not to display actual content.
     */
    async getAllStories(order: SortOrder = DEFAULT_SORT_ORDER) {
        const sortOrder = getSortByPublishedDate(order);
        const newsroom = await this.getNewsroom();
        const jsonQuery = JSON.stringify(getStoriesQuery(newsroom.uuid));
        const maxStories = newsroom.stories_number;
        const chunkSize = 200;

        const pages = Math.ceil(maxStories / chunkSize);
        const storiesPromises = Array.from({ length: pages }, (_, pageIndex) =>
            this.searchStories({
                limit: chunkSize,
                sortOrder,
                jsonQuery,
                offset: pageIndex * chunkSize,
            }),
        );

        const stories = (await Promise.all(storiesPromises)).flatMap(
            (response) => response.stories,
        );

        return stories;
    }

    async getStories({
        page = undefined,
        pageSize = DEFAULT_PAGE_SIZE,
        order = DEFAULT_SORT_ORDER,
        include,
        localeCode,
    }: GetStoriesOptions = {}) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(getStoriesQuery(this.newsroomUuid, undefined, localeCode));

        const { stories, pagination } = await this.searchStories({
            limit: pageSize,
            offset: typeof page === 'undefined' ? undefined : (page - 1) * pageSize,
            sortOrder,
            jsonQuery,
            include,
        });

        const storiesTotal = pagination.matched_records_number;

        return { stories, storiesTotal };
    }

    async getStoriesFromCategory(
        category: Category,
        {
            page = undefined,
            pageSize = DEFAULT_PAGE_SIZE,
            order = DEFAULT_SORT_ORDER,
            include,
            localeCode,
        }: GetStoriesOptions = {},
    ) {
        const sortOrder = getSortByPublishedDate(order);
        const jsonQuery = JSON.stringify(
            getStoriesQuery(this.newsroomUuid, category.id, localeCode),
        );

        const { stories, pagination } = await this.searchStories({
            limit: pageSize,
            offset: typeof page === 'undefined' ? undefined : (page - 1) * pageSize,
            sortOrder,
            jsonQuery,
            include,
        });

        const storiesTotal = pagination.matched_records_number;

        return { stories, storiesTotal };
    }

    async getStoryBySlug(slug: string) {
        const jsonQuery = JSON.stringify(getSlugQuery(this.newsroomUuid, slug));
        const { stories } = await this.searchStories({
            limit: 1,
            jsonQuery,
        });

        if (stories[0]) {
            return this.getStory(stories[0].uuid);
        }

        return null;
    }

    async getCategories(): Promise<Category[]> {
        const categories = await this.sdk.newsroomCategories.list(this.newsroomUuid, {
            sortOrder: CATEGORIES_SORT_ORDER,
        });

        return Array.isArray(categories) ? categories : Object.values(categories);
    }

    async getCategoryBySlug(slug: string) {
        const categories = await this.getCategories();

        return categories.find((category) =>
            Object.values(category.i18n).some((t) => t.slug === slug),
        );
    }

    searchStories: typeof PrezlySDK.prototype.stories.search = (options) =>
        this.sdk.stories.search(options);

    async getGalleries({ page = undefined, pageSize }: GetGalleriesOptions) {
        return this.sdk.newsroomGalleries.list(this.newsroomUuid, {
            limit: pageSize,
            offset: typeof page === 'undefined' ? undefined : (page - 1) * pageSize,
            scope: getGalleriesQuery(),
        });
    }

    async getGallery(uuid: string) {
        if (!isUuid(uuid)) {
            // Check for legacy number ID reference, which is also supported for back-compat.
            if (Number.isNaN(Number(uuid))) {
                return undefined;
            }
        }

        try {
            return await this.sdk.newsroomGalleries.get(this.newsroomUuid, uuid);
        } catch (error) {
            if (isSdkError(error) && error.status === 404) {
                return null;
            }
            throw error;
        }
    }

    /**
     * In order to prevent issues with theme preview, we only load the theme preset for a specified theme, and not the currently active one.
     */
    async getThemePreset() {
        if (this.themeUuid) {
            return this.sdk.newsroomThemes.get(this.newsroomUuid, this.themeUuid);
        }

        return null;
    }

    async getNewsroomServerSideProps(
        request: IncomingMessage | undefined,
        nextLocaleIsoCode?: string,
        story?: Story,
    ): Promise<PageProps & ServerSidePageProps> {
        const [newsroom, languages, categories, themePreset] = await Promise.all([
            this.getNewsroom(),
            this.getNewsroomLanguages(),
            this.getCategories(),
            this.getThemePreset(),
        ]);

        const currentLanguage = story
            ? getLanguageFromStory(languages, story)
            : getLanguageFromNextLocaleIsoCode(languages, nextLocaleIsoCode);
        const defaultLanguage = getDefaultLanguage(languages);

        const { code: localeCode } = currentLanguage || defaultLanguage;
        const locale = LocaleObject.fromAnyCode(localeCode);

        // TODO: if no information given for current language, show boilerplate from default language
        const companyInformation = getCompanyInformation(languages, locale);

        const algoliaSettings = getAlgoliaSettings(request);

        return {
            newsroomContextProps: {
                newsroom,
                companyInformation,
                categories,
                languages,
                localeCode,
                themePreset,
                algoliaSettings,
            },
            localeResolved: Boolean(currentLanguage),
        };
    }
}
