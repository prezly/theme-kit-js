import type { Story } from '@prezly/sdk';

import type { IndexedStory } from '../types';

export function getStoryPublicationDate(
    story: Pick<Story, 'published_at'> | IndexedStory,
): Date | null {
    const { published_at } = story;

    if (!published_at) {
        return null;
    }

    return typeof published_at === 'string'
        ? new Date(published_at)
        : new Date(published_at * 1000);
}
