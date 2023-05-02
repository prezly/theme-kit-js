import type { Newsroom } from '@prezly/sdk';
import { UploadcareImage } from '@prezly/uploadcare';

import { OG_IMAGE_API_URL } from './constants';

export function getNewsroomLogoUrl(newsroom: Pick<Newsroom, 'newsroom_logo'>): string {
    if (newsroom.newsroom_logo) {
        const image = UploadcareImage.createFromPrezlyStoragePayload(newsroom.newsroom_logo);
        return image.cdnUrl;
    }

    return '';
}

export function getNewsroomFaviconUrl(
    newsroom: Pick<Newsroom, 'icon' | 'square_logo'>,
    previewSize = 400,
): string {
    const imageObject = newsroom.icon || newsroom.square_logo;

    if (imageObject) {
        const image = UploadcareImage.createFromPrezlyStoragePayload(imageObject);
        return image.preview(previewSize, previewSize).cdnUrl;
    }

    return '';
}

export function getNewsroomOgImageUrl(newsroom: Pick<Newsroom, 'uuid'>): string {
    return `${OG_IMAGE_API_URL}/${newsroom.uuid}`;
}
