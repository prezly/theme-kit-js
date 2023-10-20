import { Locale } from '@prezly/theme-kit-intl';

import { getFallbackLocale } from './getFallbackLocale';

describe('getFallbackLocale', () => {
    it('should return selected region-dependent fallback locale for English', () => {
        expect(
            getFallbackLocale('en', [
                Locale.from('en_US'),
                Locale.from('en_GB'),
                Locale.from('en_DE'),
            ]),
        ).toEqual(Locale.from('en_US'));

        expect(getFallbackLocale('en', [Locale.from('en_GB'), Locale.from('en_DE')])).toEqual(
            Locale.from('en_GB'),
        );

        expect(getFallbackLocale('en', [Locale.from('en_DE')])).toBeUndefined();
    });

    it('should return selected region-dependent fallback locale for French', () => {
        expect(
            getFallbackLocale('fr', [
                Locale.from('en_US'),
                Locale.from('fr_FR'),
                Locale.from('fr_CA'),
                Locale.from('fr_BE'),
            ]),
        ).toEqual(Locale.from('fr_FR'));

        expect(
            getFallbackLocale('fr', [
                Locale.from('en_US'),
                Locale.from('fr_CA'),
                Locale.from('fr_BE'),
            ]),
        ).toEqual(Locale.from('fr_CA'));

        expect(getFallbackLocale('fr', [Locale.from('fr_BE')])).toBeUndefined();
    });

    it('should return undefined for other languages', () => {
        expect(
            getFallbackLocale('es', [
                Locale.from('en_US'),
                Locale.from('fr_FR'),
                Locale.from('fr_CA'),
                Locale.from('fr_BE'),
            ]),
        ).toBeUndefined();

        expect(
            getFallbackLocale('nl', [
                Locale.from('en_US'),
                Locale.from('fr_CA'),
                Locale.from('fr_BE'),
            ]),
        ).toBeUndefined();
    });
});
