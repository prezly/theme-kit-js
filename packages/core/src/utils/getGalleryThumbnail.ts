import type { NewsroomGallery, UploadedImage } from '@prezly/sdk';

export function getGalleryThumbnail(gallery: NewsroomGallery) {
    const { thumbnail_image, images } = gallery;

    if (thumbnail_image) {
        return JSON.parse(thumbnail_image) as UploadedImage;
    }

    if (images.length) {
        return images[0].uploadcare_image;
    }

    return null;
}
