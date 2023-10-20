import { LANGUAGES } from '../__mocks__/languages';

import { getShortestLocaleSlug } from './getShortestLocaleSlug';

const ALL_LANGUAGES = Object.values(LANGUAGES);

describe('getShortestLocaleSlug', () => {
    it('returns false for default language', () => {
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'en')).toBe(false);
    });

    it('returns neutral language code if it is the only culture with that language', () => {
        expect(
            getShortestLocaleSlug(
                ALL_LANGUAGES.filter(({ code }) => code !== 'es_419'),
                'es-ES',
            ),
        ).toBe('es');
    });

    it('returns region code if it is the only culture with that region', () => {
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'en-US')).toBe('us');
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'en-GB')).toBe('gb');
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'nl-NL')).toBe('nl-nl'); // cannot use `nl`, as it collides with language code
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'fr')).toBe('fr');
    });

    it('returns full code if it can not be shortened', () => {
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'fr-BE')).toBe('fr-be');
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'nl-BE')).toBe('nl-be');
    });

    it('returns full code when trying to shorten to region code for es-419', () => {
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'es-419')).toBe('es-419');
    });
});
