import type { CultureRef, Story } from '@prezly/sdk';

export type StoryWithImage = Story & Pick<Story.ExtraFields, 'thumbnail_image'>;

/**
 * Algolia category type
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
