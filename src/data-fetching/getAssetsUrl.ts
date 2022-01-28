import { ASSETS_URL } from './constants';

export function getAssetsUrl(uuid: string) {
    return `${ASSETS_URL}/${uuid}/`;
}
