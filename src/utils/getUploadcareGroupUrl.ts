import { ASSETS_URL } from './constants';

/**
 * This method constructs a URL to download all images in the Gallery as a single archive.
 *
 * @param uuid Gallery UUID
 * @param title Filename for the saved archive. Usually it is the Gallery title.
 * @returns URL to an archive containing all of the images in the Gallery.
 */
export function getUploadcareGroupUrl(uuid: string, title: string) {
    return `${ASSETS_URL}/${uuid}/archive/zip/${encodeURI(title)}.zip`;
}
