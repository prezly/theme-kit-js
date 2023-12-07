import type { CultureRef, Story } from '@prezly/sdk';

export interface AlgoliaEnv {
    ALGOLIA_API_KEY: string;
    ALGOLIA_APP_ID: string;
    ALGOLIA_INDEX: string;
}

export interface PrezlyNewsroomEnv {
    PREZLY_ACCESS_TOKEN: string;
    PREZLY_NEWSROOM_UUID: string;
    PREZLY_THEME_UUID?: string;
    PREZLY_MODE?: 'preview';
}

export interface PrezlyEnv extends PrezlyNewsroomEnv, AlgoliaEnv {}

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
    Pick<Story.ExtraFields, 'thumbnail_image'> & {
        content_text: string;
        updated_at: number;
        published_at: number;
        culture: Pick<CultureRef, 'code' | 'name' | 'native_name' | 'language_code'>;
        categories: AlgoliaCategoryRef[];
    };
