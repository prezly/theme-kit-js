import type { CultureRef, ExtraStoryFields, Story } from '@prezly/sdk';

import type { NewsroomContextProps } from './newsroom-context';

export interface ServerSidePageProps {
    /**
     * Indicates whether the locale requested by the Next application was correctly resolved to an active newsroom locale.
     * This is used by `processRequest` method to redirect to the default locale if the property is `false`.
     */
    localeResolved: boolean;
}

/**
 * These are the props returned by the `processRequest` method that are meant to be passed to your `_app` to be injected into the `NewsroomContextProvider`.
 */
export interface PageProps {
    newsroomContextProps: NewsroomContextProps;
}

/**
 * Categories in Algolia index are stored in a simplified format, with `slug` and `name` properties already saved in the correct locale for the story search result.
 */
export interface AlgoliaCategoryRef {
    id: number;
    name: string;
    slug: string;
}

/**
 * Stories in Algolia index are stored in a simplified format, with only minimal subset of fields.
 */
export type AlgoliaStory = Pick<Story, 'uuid' | 'slug' | 'title' | 'subtitle'> &
    Pick<ExtraStoryFields, 'thumbnail_image'> & {
        content_text: string;
        updated_at: number;
        published_at: number;
        culture: Pick<CultureRef, 'code' | 'name' | 'native_name' | 'language_code'>;
        categories: AlgoliaCategoryRef[];
    };
