import type { Culture, Story } from '@prezly/sdk';
import { type AlgoliaStory, getStoryPublicationDate } from '@prezly/theme-kit-core';

interface Props {
    story: Story | AlgoliaStory;
    locale?: Culture['code'];
}

export function StoryPublicationDate({ story, locale }: Props) {
    const date = getStoryPublicationDate(story);

    if (!date) {
        return null;
    }

    return (
        <>{date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</>
    );
}
