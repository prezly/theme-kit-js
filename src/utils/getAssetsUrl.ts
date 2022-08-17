import type { UploadedImage } from '@prezly/sdk';

import { ASSETS_URL } from './constants';

/**
 * @param image `UploadedImage` object of the asset hosted on UploadCare
 * @returns Full asset URL that can be used as a source for <img>, <video> and <a> tags.
 */
export function getAssetsUrl(image: UploadedImage) {
    const assetUrl = `${ASSETS_URL}/${image.uuid}/`;
    if (image.effects.length > 0) {
        const img = `${assetUrl}-${image.effects.join('-')}`;
        return img;
    }
    return assetUrl;
}
