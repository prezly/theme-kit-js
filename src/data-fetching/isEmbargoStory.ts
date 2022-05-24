import type { Story } from '@prezly/sdk';

export type EmbargoStory = Omit<Story, 'is_embargo' | 'published_at'> & {
    is_embargo: true;
    published_at: string;
};

export function isEmbargoStory(story: Story): story is EmbargoStory {
    return story.is_embargo && Boolean(story.published_at);
}
