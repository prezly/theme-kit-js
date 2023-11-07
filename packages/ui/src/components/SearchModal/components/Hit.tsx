import type { Culture } from '@prezly/sdk';
import type { AlgoliaStory } from '@prezly/theme-kit-core';

import { StoryCard } from '@/components/StoryCard';

export interface Props {
    hit: { attributes: AlgoliaStory };
    locale: Culture['code'];
    newsroomName: string;
}

export function Hit({ hit, locale, newsroomName }: Props) {
    const { attributes: story } = hit;

    return (
        <StoryCard
            className="w-full mb-6 last:mb-0"
            story={story}
            locale={locale}
            newsroomName={newsroomName}
            size="tiny"
        />
    );
}
