import type { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

import type { AlgoliaStory, StoryWithImage } from '../types';

export function getStoryThumbnail(
    story: StoryWithImage | AlgoliaStory,
): UploadcareImageDetails | null {
    const { thumbnail_image } = story;

    if (thumbnail_image) {
        return JSON.parse(thumbnail_image);
    }

    return null;
}
