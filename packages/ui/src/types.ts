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
 * Stories in Algolia/MeiliSearch index are stored in a simplified format, with only minimal subset of fields.
 */
export type AlgoliaStory = Pick<Story, 'uuid' | 'slug' | 'title' | 'subtitle'> &
    Pick<Story.ExtraFields, 'thumbnail_image'> & {
        content_text: string;
        updated_at: number;
        published_at: number;
        url: string | null;
        culture: Pick<CultureRef, 'code' | 'name' | 'native_name' | 'language_code'>;
        categories: AlgoliaCategoryRef[];
    };

/**
 * Story sections in the MeiliSearch `public_stories_v2` index.
 * Each document represents a single content section of a story,
 * enabling section-level search with anchor link navigation via `url`.
 */
export type AlgoliaStorySection = Omit<AlgoliaStory, 'content_text'> & {
    content_text: string | null;
    section_title: string | null;
    section_subtitle: string | null;
};
