import type { Newsroom } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';
import { UploadcareImage } from '@prezly/uploadcare';

import { OG_IMAGE_API_URL } from './constants';

export function getLogoUrl(
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

export function getFaviconUrl(
    newsroom: Pick<Newsroom, 'icon' | 'square_logo'>,
    previewSize = 400,
): string | undefined {
    const imageObject = newsroom.icon || newsroom.square_logo;

    if (imageObject) {
        const image = UploadcareImage.createFromPrezlyStoragePayload(imageObject);
        return image.preview(previewSize, previewSize).cdnUrl;
    }

    return undefined;
}

export function getOgImageUrl(
    newsroom: Pick<Newsroom, 'uuid'>,
    locale?: Locale | Locale.Code,
): string {
    const url = `${OG_IMAGE_API_URL}/${newsroom.uuid}`;

    if (locale) {
        const { slug } = Locale.from(locale);
        return `${url}?locale=${slug}`;
    }

    return url;
}
