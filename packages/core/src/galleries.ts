import type { NewsroomGallery, UploadedImage } from '@prezly/sdk';

import { ASSETS_CDN_URL } from './constants';

export function isEmpty(
    gallery: Pick<NewsroomGallery, 'images_number' | 'videos_number'>,
): boolean {
    return gallery.images_number === 0 && gallery.videos_number === 0;
}

export function getCoverImage(gallery: Pick<NewsroomGallery, 'thumbnail_image' | 'images'>) {
    const { thumbnail_image, images } = gallery;

    if (thumbnail_image) {
        return JSON.parse(thumbnail_image) as UploadedImage;
    }

    if (images.length) {
        return images[0].uploadcare_image;
    }

    return null;
}

/**
 * This method constructs a URL to download all images in the Gallery as a single archive.
 *
 * @param uuid Gallery UUID
 * @param title Filename for the saved archive. Usually it is the Gallery title.
 * @returns URL to an archive containing all of the images in the Gallery.
 */
export function getArchiveDownloadUrl(uuid: string, title: string) {
    // UploadCare doesn't like slashes in filenames even in encoded form.
    return `${ASSETS_CDN_URL}/${uuid}/archive/zip/${encodeURIComponent(
        title.replace(/\//g, '_'),
    )}.zip`;
}
