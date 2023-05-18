import { DEFAULT_LOCALE, getLocaleDirection, getSupportedLocaleIsoCode } from './locale';
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
