import { jest } from '@jest/globals';

import { DEFAULT_LOCALE, getSupportedLocaleIsoCode } from './locale';

describe('getSupportedLocaleIsoCode', () => {
    it('returns a code by exact match', () => {
        expect(getSupportedLocaleIsoCode('en')).toBe('en');
        expect(getSupportedLocaleIsoCode('af')).toBe('af');
        expect(getSupportedLocaleIsoCode('pt-BR')).toBe('pt-BR');
    });

    it('returns a code by neutral language code match', () => {
        expect(getSupportedLocaleIsoCode('en-US')).toBe('en');
        expect(getSupportedLocaleIsoCode('de-DE')).toBe('de');
        expect(getSupportedLocaleIsoCode('uk-UA')).toBe('uk');
    });

    it('returns custom mapped codes for Chinese locales', () => {
        expect(getSupportedLocaleIsoCode('zh-Hant')).toBe('zh-TW');
        expect(getSupportedLocaleIsoCode('zh-HK')).toBe('zh-CN');
    });

    it('returns default locale code for unsupported languages', () => {
        const consoleSpy = jest.spyOn(console, 'warn');

        expect(getSupportedLocaleIsoCode('aa')).toBe(DEFAULT_LOCALE);
        expect(consoleSpy).toHaveBeenCalledWith('Unsupported locale provided: "aa".');
    });
});
