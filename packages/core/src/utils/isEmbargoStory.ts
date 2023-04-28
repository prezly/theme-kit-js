import type { Story } from '@prezly/sdk';

import { isScheduledEmbargo } from './sdkHelpers';

export type EmbargoStory = Omit<Story, 'is_embargo' | 'published_at'> & {
    is_embargo: true;
    published_at: string;
};

export function isEmbargoStory(story: Pick<Story, 'status'>): story is EmbargoStory {
    return isScheduledEmbargo(story.status);
}
