import type { UploadedImage } from '@prezly/sdk';

import { ASSETS_URL } from './constants';

/**
 * @param image The `UploadedImage` object or uuid of the asset hosted on Uploadcare
 * @returns Full asset URL that can be used as a source for <img>, <video> and <a> tags.
 */
export function getAssetsUrl(image: UploadedImage | string) {
    if (typeof image === 'string') {
        return `${ASSETS_URL}/${image}/`;
    }
    if (image.effects.length > 0) {
        return `${ASSETS_URL}/${image.uuid}/-${image.effects.join('-')}`;
    }
    return `${ASSETS_URL}/${image.uuid}/`;
}
