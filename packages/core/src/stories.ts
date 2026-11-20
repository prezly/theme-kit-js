import { Story } from '@prezly/sdk';
import type { StoryRef } from '@prezly/sdk';

/**
 * Tells whether anyone can open the story on the site right now.
 *
 * A published story is not necessarily public: private and confidential stories are published too,
 * and only people who were given the link should reach them.
 */
export function isPubliclyPublished(story: Pick<StoryRef, 'status' | 'visibility'>): boolean {
    return story.status === Story.Status.PUBLISHED && story.visibility === Story.Visibility.PUBLIC;
}

/**
 * Lists the story translations a page can link to.
 *
 * The API returns every translation of a story, whatever its status and visibility. Linking to a
 * draft, scheduled, embargoed, private or confidential translation would disclose it to visitors.
 */
export function getPublicTranslations(story: Pick<Story, 'translations'>): StoryRef[] {
    return story.translations.filter(isPubliclyPublished);
}
