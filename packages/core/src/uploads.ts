import { ASSETS_CDN_URL } from './constants';

/**
 * @param uuid UUID of the assets hosted on Uploadcare
 * @returns Full asset URL that can be used as a source for <img>, <video> and <a> tags.
 */
export function getCdnUrl(uuid: string) {
    return `${ASSETS_CDN_URL}/${uuid}/`;
}
