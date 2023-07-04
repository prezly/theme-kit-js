import type { NewsroomGallery } from '@prezly/sdk';

export function isGalleryEmpty(gallery: NewsroomGallery): boolean {
    return gallery.images_number === 0 && gallery.videos_number === 0;
}
