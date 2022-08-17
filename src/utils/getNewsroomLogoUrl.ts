import type { Newsroom } from '@prezly/sdk';

import { getAssetsUrl } from './getAssetsUrl';

export function getNewsroomLogoUrl(newsroom: Newsroom): string {
    if (newsroom.newsroom_logo) {
        return getAssetsUrl(newsroom.newsroom_logo);
    }

    return '';
}

export function getNewsroomFaviconUrl(newsroom: Newsroom, previewSize = 400): string {
    const image = newsroom.icon || newsroom.square_logo;
    if (image) {
        return `${getAssetsUrl(image)}-/preview/${previewSize}x${previewSize}/-/quality/best/`;
    }

    return '';
}
