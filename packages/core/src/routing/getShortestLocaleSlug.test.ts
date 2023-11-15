import type { Locale } from '@prezly/theme-kit-intl';

import { LANGUAGES } from '../__mocks__/languages';

import { getShortestLocaleSlug } from './getShortestLocaleSlug';

const locales = Object.values(LANGUAGES).map((lang) => lang.code);
const defaultLocale = Object.values(LANGUAGES)
    .filter((lang) => lang.is_default)
    .map((lang) => lang.code)[0]!;

const context = { locales, defaultLocale };

function without(locales: Locale.Code[], exclude: Locale.Code) {
    return locales.filter((code) => code !== exclude);
}

describe('getShortestLocaleSlug', () => {
    it('returns false for default language', () => {
        expect(getShortestLocaleSlug('en', context)).toBe(false);
    });

    it('returns neutral language code if it is the only culture with that language', () => {
        expect(
            getShortestLocaleSlug('es_ES', {
                locales: without(locales, 'es_419'),
                defaultLocale,
            }),
        ).toBe('es');
    });

    it('returns region code if it is the only culture with that region', () => {
        expect(getShortestLocaleSlug('en_US', context)).toBe('us');
        expect(getShortestLocaleSlug('en_GB', context)).toBe('gb');
        expect(getShortestLocaleSlug('nl_NL', context)).toBe('nl-nl'); // cannot use `nl`, as it collides with language code
        expect(getShortestLocaleSlug('fr', context)).toBe('fr');
    });

    it('returns full code if it can not be shortened', () => {
        expect(getShortestLocaleSlug('fr_BE', context)).toBe('fr-be');
        expect(getShortestLocaleSlug('nl_BE', context)).toBe('nl-be');
    });

    it('returns full code when trying to shorten to region code for es-419', () => {
        expect(getShortestLocaleSlug('es_419', context)).toBe('es-419');
    });
});
