import type { Newsroom } from '@prezly/sdk';
import { UploadcareImage } from '@prezly/uploadcare';

export function getNewsroomLogoUrl(newsroom: Newsroom): string {
    if (newsroom.newsroom_logo) {
        const image = UploadcareImage.createFromPrezlyStoragePayload(newsroom.newsroom_logo);
        return image.cdnUrl;
    }

    return '';
}

export function getNewsroomFaviconUrl(newsroom: Newsroom, previewSize = 400): string {
    const imageObject = newsroom.icon || newsroom.square_logo;

    if (imageObject) {
        const image = UploadcareImage.createFromPrezlyStoragePayload(imageObject);
        return image.preview(previewSize, previewSize).cdnUrl;
    }

    return '';
}
