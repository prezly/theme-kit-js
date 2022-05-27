import { ASSETS_URL } from './constants';
import { getAssetsUrl } from './getAssetsUrl';

describe('getAssetsUrl', () => {
    it('generates correct asset URL', () => {
        const uuid = 'test-uuid';

        expect(getAssetsUrl(uuid)).toBe(`${ASSETS_URL}/${uuid}/`);
    });
});
