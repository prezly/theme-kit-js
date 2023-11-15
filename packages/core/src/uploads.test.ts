import { ASSETS_CDN_URL } from './constants';
import { getCdnUrl } from './uploads';

describe('getCdnUrl', () => {
    it('generates correct asset URL with uuid passed to it', () => {
        const uuid = 'foo-bar';
        expect(getCdnUrl(uuid)).toBe(`${ASSETS_CDN_URL}/${uuid}/`);
    });
});
