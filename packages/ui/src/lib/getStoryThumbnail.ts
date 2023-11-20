import type { UploadcareImageDetails } from '@prezly/uploadcare-image/build/types';

export function getStoryThumbnail(story: {
    thumbnailImage: string | null;
}): UploadcareImageDetails | null {
    const { thumbnailImage } = story;

    if (thumbnailImage) {
        return JSON.parse(thumbnailImage);
    }

    return null;
}
