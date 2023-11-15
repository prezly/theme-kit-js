import type { CultureRef, Story } from '@prezly/sdk';

/**
 * Categories in Algolia index are stored in a simplified format, with `slug` and `name` properties already saved in the correct locale for the story search result.
 */
export interface IndexedCategoryRef {
    id: number;
    name: string;
    slug: string;
}

// prettier-ignore
/**
 * Stories in Algolia index are stored in a simplified format, with only minimal subset of fields.
 */
export type IndexedStory =
    Pick<Story, 'uuid' | 'slug' | 'title' | 'subtitle'> &
    Pick<Story.ExtraFields, 'thumbnail_image'> &
    {
        content_text: string;
        updated_at: number;
        published_at: number;
        culture: Pick<CultureRef, 'code' | 'name' | 'native_name' | 'language_code'>;
        categories: IndexedCategoryRef[];
    };
