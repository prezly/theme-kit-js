import { jest } from '@jest/globals';
import {
    DEFAULT_LOCALE,
    DUMMY_DEFAULT_LOCALE,
    getLocaleDirection,
    getRedirectToCanonicalLocale,
    getSupportedLocaleIsoCode,
} from './locale';
import { LocaleObject } from './localeObject';

describe('getSupportedLocaleIsoCode', () => {
    it('returns a code by exact match', () => {
        expect(getSupportedLocaleIsoCode(LocaleObject.fromAnyCode('en'))).toBe('en');
        expect(getSupportedLocaleIsoCode(LocaleObject.fromAnyCode('af'))).toBe('af');
        expect(getSupportedLocaleIsoCode(LocaleObject.fromAnyCode('pt-BR'))).toBe('pt-BR');
    });

    it('returns a code by neutral language code match', () => {
        expect(getSupportedLocaleIsoCode(LocaleObject.fromAnyCode('en-US'))).toBe('en');
        expect(getSupportedLocaleIsoCode(LocaleObject.fromAnyCode('de-DE'))).toBe('de');
        expect(getSupportedLocaleIsoCode(LocaleObject.fromAnyCode('uk-UA'))).toBe('uk');
    });

    it('returns custom mapped codes for Chinese locales', () => {
        expect(getSupportedLocaleIsoCode(LocaleObject.fromAnyCode('zh-Hant'))).toBe('zh-TW');
        expect(getSupportedLocaleIsoCode(LocaleObject.fromAnyCode('zh-HK'))).toBe('zh-CN');
    });

    it('returns default locale code for unsupported languages', () => {
        const consoleSpy = jest.spyOn(console, 'warn');

        // @ts-expect-error
        expect(getSupportedLocaleIsoCode(new LocaleObject('aa'))).toBe(DEFAULT_LOCALE);
        expect(consoleSpy).toHaveBeenCalledWith(
            'Unsupported locale provided. Please use `LocaleObject.fromAnyCode` to ensure you are using a correct language code',
        );
    });
});

describe('getRedirectToCanonicalLocale', () => {
    it('returns undefined when no locale or dummy locale is provided', () => {
        expect(getRedirectToCanonicalLocale('en', undefined, '/')).toBe(undefined);
        expect(getRedirectToCanonicalLocale('en', DUMMY_DEFAULT_LOCALE, '/')).toBe(undefined);
    });

    it('returns undefined when locale is already canonical', () => {
        expect(getRedirectToCanonicalLocale('en', 'en', '/')).toBe(undefined);
        expect(getRedirectToCanonicalLocale('nl_BE', 'nl-be', '/')).toBe(undefined);
    });

    it('returns a redirect object when requested locale is not canonical', () => {
        expect(getRedirectToCanonicalLocale(false, 'en-us', '/test')).toEqual({
            destination: '/test',
            permanent: false,
        });

        expect(getRedirectToCanonicalLocale('en', 'en-us', '/test')).toEqual({
            destination: '/en/test',
            permanent: false,
        });

        expect(getRedirectToCanonicalLocale('en', 'en-us', 'test')).toEqual({
            destination: '/en/test',
            permanent: false,
        });
    });

    it('preserves query parameters', () => {
        expect(
            getRedirectToCanonicalLocale('en', 'en-us', '/test', {
                page: '1',
                tags: ['story', 'media'],
            }),
        ).toEqual({
            destination: '/en/test?page=1&tags=story&tags=media',
            permanent: false,
        });
    });
});

describe('getLocaleDirection', () => {
    it('returns `rtl` for right-to-left languages', () => {
        const RTL_LANGUAGES = ['ar', 'ar-AE', 'ar-BH', 'ar-QA', 'ar-SA', 'he-IL', 'ur-PK'];
        RTL_LANGUAGES.forEach((language) => {
            expect(getLocaleDirection(LocaleObject.fromAnyCode(language))).toBe('rtl');
        });
    });

    it('returns `ltr` for other languages', () => {
        const LTR_LANGUAGES = ['en', 'en-US', 'fr-FR', 'fil', 'pt-BR', 'nl', 'nl-BE'];
        LTR_LANGUAGES.forEach((language) => {
            expect(getLocaleDirection(LocaleObject.fromAnyCode(language))).toBe('ltr');
        });
    });
});
