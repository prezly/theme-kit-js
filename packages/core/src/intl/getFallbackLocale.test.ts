import { getFallbackLocale } from './getFallbackLocale';
import { LocaleObject } from './localeObject';

describe('getFallbackLocale', () => {
    it('should return selected region-dependent fallback locale for English', () => {
        expect(
            getFallbackLocale('en', [
                LocaleObject.fromAnyCode('en_US'),
                LocaleObject.fromAnyCode('en_GB'),
                LocaleObject.fromAnyCode('en_DE'),
            ]),
        ).toEqual(LocaleObject.fromAnyCode('en_US'));

        expect(
            getFallbackLocale('en', [
                LocaleObject.fromAnyCode('en_GB'),
                LocaleObject.fromAnyCode('en_DE'),
            ]),
        ).toEqual(LocaleObject.fromAnyCode('en_GB'));

        expect(getFallbackLocale('en', [LocaleObject.fromAnyCode('en_DE')])).toBeUndefined();
    });

    it('should return selected region-dependent fallback locale for French', () => {
        expect(
            getFallbackLocale('fr', [
                LocaleObject.fromAnyCode('en_US'),
                LocaleObject.fromAnyCode('fr_FR'),
                LocaleObject.fromAnyCode('fr_CA'),
                LocaleObject.fromAnyCode('fr_BE'),
            ]),
        ).toEqual(LocaleObject.fromAnyCode('fr_FR'));

        expect(
            getFallbackLocale('fr', [
                LocaleObject.fromAnyCode('en_US'),
                LocaleObject.fromAnyCode('fr_CA'),
                LocaleObject.fromAnyCode('fr_BE'),
            ]),
        ).toEqual(LocaleObject.fromAnyCode('fr_CA'));

        expect(getFallbackLocale('fr', [LocaleObject.fromAnyCode('fr_BE')])).toBeUndefined();
    });

    it('should return undefined for other languages', () => {
        expect(
            getFallbackLocale('es', [
                LocaleObject.fromAnyCode('en_US'),
                LocaleObject.fromAnyCode('fr_FR'),
                LocaleObject.fromAnyCode('fr_CA'),
                LocaleObject.fromAnyCode('fr_BE'),
            ]),
        ).toBeUndefined();

        expect(
            getFallbackLocale('nl', [
                LocaleObject.fromAnyCode('en_US'),
                LocaleObject.fromAnyCode('fr_CA'),
                LocaleObject.fromAnyCode('fr_BE'),
            ]),
        ).toBeUndefined();
    });
});
