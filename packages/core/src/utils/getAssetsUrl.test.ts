import { ASSETS_URL } from '../constants';

import { getAssetsUrl } from './getAssetsUrl';

describe('getAssetsUrl', () => {
    it('generates correct asset URL with uuid passed to it', () => {
        const uuid = 'foo-bar';
        expect(getAssetsUrl(uuid)).toBe(`${ASSETS_URL}/${uuid}/`);
    });
});
