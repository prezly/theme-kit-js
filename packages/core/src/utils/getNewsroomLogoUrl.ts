import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { UploadcareImage } from '@prezly/uploadcare';

import { OG_IMAGE_API_URL } from './constants';

export function getNewsroomLogoUrl(
    newsroom: Pick<Newsroom, 'newsroom_logo'>,
    previewSize?: number,
): string {
    if (newsroom.newsroom_logo) {
        const image = UploadcareImage.createFromPrezlyStoragePayload(newsroom.newsroom_logo);
        if (previewSize) {
            return image.preview(previewSize, previewSize).cdnUrl;
        }

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

export function getNewsroomOgImageUrl(newsroom: Pick<Newsroom, 'uuid'>, locale?: Locale): string {
    return `${OG_IMAGE_API_URL}/${newsroom.uuid}${locale ? `?locale=${locale.slug}` : ''}`;
}
