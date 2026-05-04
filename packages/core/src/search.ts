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
 * Stories in Algolia/MeiliSearch index are stored in a simplified format, with only minimal subset of fields.
 */
export type IndexedStory = Pick<Story, 'uuid' | 'slug' | 'title' | 'subtitle'> &
    Pick<Story.ExtraFields, 'thumbnail_image'> & {
        content_text: string;
        updated_at: number;
        published_at: number;
        url: string | null;
        culture: Pick<CultureRef, 'code' | 'name' | 'native_name' | 'language_code'>;
        categories: IndexedCategoryRef[];
    };

/**
 * Story sections in the MeiliSearch `public_stories_v2` index.
 * Each document represents a single content section (paragraph, callout, quote, etc.)
 * of a story, enabling section-level search with anchor link navigation.
 */
export type IndexedStorySection = Omit<IndexedStory, 'content_text'> & {
    content_text: string | null;
    section_title: string | null;
    section_subtitle: string | null;
};
