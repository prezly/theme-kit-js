import { Story } from '@prezly/sdk';

export type EmbargoStory = Omit<Story, 'is_embargo' | 'published_at'> & {
    is_embargo: true;
    published_at: string;
};

export function isEmbargoStory(story: Pick<Story, 'lifecycle_status'>): story is EmbargoStory {
    // TODO: This leaks `@prezly/sdk` into client bundle
    return Story.isScheduledEmbargo(story);
}
