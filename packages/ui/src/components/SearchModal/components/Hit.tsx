import type { Culture, UploadedImage } from '@prezly/sdk';

import { StoryCard } from '@/components/StoryCard';
import type { AlgoliaStory } from '@/types';

export function Hit({ hit, showSubtitle = true, locale, logo, newsroomName, showDate }: Hit.Props) {
    const { attributes: story } = hit;

    const displayedStory: StoryCard.DisplayedStory = {
        title: story.title,
        subtitle: story.subtitle,
        thumbnailImage: story.thumbnail_image,
        href: `/${story.slug}`, // TODO: move URL generation outside of ui package
    };

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
            showSubtitle={showSubtitle}
            showDate={showDate}
            logo={logo}
            locale={locale}
            newsroomName={newsroomName}
            story={displayedStory}
            categories={displayedCategories}
            size="tiny"
        />
    );
}

export namespace Hit {
    export interface Props {
        hit: { attributes: AlgoliaStory };
        showSubtitle: boolean;
        locale: Culture['code'];
        newsroomName: string;
        logo: UploadedImage | null;
        showDate: boolean;
    }
}
