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

    const displayedCategories = story.categories.map(
        (category): StoryCard.DisplayedCategory => ({
            id: category.id,
            name: category.name,
            href: `/category/${category.slug}`, // TODO: Lift URL generation from here
        }),
    );

    return (
        <StoryCard
            className="w-full mt-6"
            hideSubtitle={hideSubtitle}
            showDate={showDate}
            logo={logo}
            locale={locale}
            newsroomName={newsroomName}
            story={story}
            categories={displayedCategories}
            size="tiny"
        />
    );
}
