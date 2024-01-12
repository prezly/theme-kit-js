/* eslint-disable @typescript-eslint/naming-convention */
import type { Locale } from '@prezly/theme-kit-intl';

import { matchLocaleSlug } from './matchLocaleSlug';

describe('matchLocaleSlug', () => {
    it('should match enabled locales by full locale slug', () => {
        const locales: Locale.Code[] = ['nl_BE', 'nl_NL', 'en'];

        expect(matchLocaleSlug('nl-be', locales)).toBe('nl_BE');
        expect(matchLocaleSlug('nl-nl', locales)).toBe('nl_NL');
        expect(matchLocaleSlug('en', locales)).toBe('en');
    });

    it('should return undefined if no active locale matches locale slug', () => {
        const locales: Locale.Code[] = ['nl_BE', 'nl_NL', 'en'];

        expect(matchLocaleSlug('fr-be', locales)).toBeUndefined();
        expect(matchLocaleSlug('en-us', locales)).toBeUndefined();
        expect(matchLocaleSlug('de-de', locales)).toBeUndefined();
    });

    it('should match locale by lang code slug', () => {
        const locales: Locale.Code[] = ['nl_BE', 'en_US', 'fr_BE'];

        expect(matchLocaleSlug('nl', locales)).toBe('nl_BE');
        expect(matchLocaleSlug('fr', locales)).toBe('fr_BE');
        expect(matchLocaleSlug('en', locales)).toBe('en_US');
    });

    it('should match locale by region code slug', () => {
        const locales: Locale.Code[] = ['nl_BE', 'en_GB', 'en_US'];

        expect(matchLocaleSlug('be', locales)).toBe('nl_BE');
        expect(matchLocaleSlug('gb', locales)).toBe('en_GB');
        expect(matchLocaleSlug('us', locales)).toBe('en_US');
    });

    it('should never match locale by number-only region code slug', () => {
        const locales: Locale.Code[] = ['es_ES', 'es_419'];

        expect(matchLocaleSlug('419', locales)).toBeUndefined();
    });

    it('should pick locale in the given order of preference if multiple match against th shortened lang code', () => {
        expect(matchLocaleSlug('en', ['en_GB', 'en_US', 'nl_BE'])).toBe('en_GB');
        expect(matchLocaleSlug('en', ['nl_BE', 'en_US', 'en_GB'])).toBe('en_US');
    });

    it('should pick locale in the given order of preference if multiple match against th shortened region code', () => {
        expect(matchLocaleSlug('be', ['nl_BE', 'fr_BE', 'en_GB'])).toBe('nl_BE');
        expect(matchLocaleSlug('be', ['en_GB', 'fr_BE', 'nl_BE'])).toBe('fr_BE');
    });
});
