import type { CultureRef, Story } from '@prezly/sdk';

export type StoryWithImage = Story & Pick<Story.ExtraFields, 'thumbnail_image'>;
/**
 * Algolia/MeiliSearch category type
 */
export interface IndexedCategoryRef {
    id: number;
    name: string;
    slug: string;
}
/**
 * Stories in Algolia/MeiliSearch index are stored in a simplified format, with only minimal subset of fields.
 */
export type IndexedStory = Pick<Story, 'uuid' | 'slug' | 'title' | 'subtitle'> &
    Pick<Story.ExtraFields, 'thumbnail_image'> & {
        content_text: string;
        updated_at: number;
        published_at: number;
        culture: Pick<CultureRef, 'code' | 'name' | 'native_name' | 'language_code'>;
        categories: IndexedCategoryRef[];
    };
