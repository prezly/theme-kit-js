import type { Culture, UploadedImage } from '@prezly/sdk';
import type { AlgoliaStory } from '@prezly/theme-kit-core';

import { StoryCard } from '@/components/StoryCard';

export interface Props {
    hit: { attributes: AlgoliaStory };
    hideSubtitle: boolean;
    locale: Culture['code'];
    newsroomName: string;
    logo: UploadedImage | null;
    showDate: boolean;
}

export function Hit({ hit, hideSubtitle, locale, logo, newsroomName, showDate }: Props) {
    const { attributes: story } = hit;

    return (
        <StoryCard
            className="w-full mt-6"
            hideSubtitle={hideSubtitle}
            showDate={showDate}
            logo={logo}
            locale={locale}
            newsroomName={newsroomName}
            story={story}
            size="tiny"
        />
    );
}
