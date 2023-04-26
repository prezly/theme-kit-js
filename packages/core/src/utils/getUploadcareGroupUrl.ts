import { ASSETS_URL } from './constants.js';

/**
 * This method constructs a URL to download all images in the Gallery as a single archive.
 *
 * @param uuid Gallery UUID
 * @param title Filename for the saved archive. Usually it is the Gallery title.
 * @returns URL to an archive containing all of the images in the Gallery.
 */
export function getUploadcareGroupUrl(uuid: string, title: string) {
    // UploadCare doesn't like slashes in filenames even in encoded form.
    return `${ASSETS_URL}/${uuid}/archive/zip/${encodeURIComponent(title.replace(/\//g, '_'))}.zip`;
}
