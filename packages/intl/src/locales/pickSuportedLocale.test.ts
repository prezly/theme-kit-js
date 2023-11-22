import { jest } from '@jest/globals';

import { DEFAULT_LOCALE, pickSupportedLocale } from './pickSuportedLocale';

describe('pickSupportedLocale', () => {
    it('returns a code by exact match', () => {
        expect(pickSupportedLocale('en')).toBe('en');
        expect(pickSupportedLocale('af')).toBe('af');
        expect(pickSupportedLocale('pt_BR')).toBe('pt-BR');
    });

    it('returns a code by neutral language code match', () => {
        expect(pickSupportedLocale('en_US')).toBe('en');
        expect(pickSupportedLocale('de_DE')).toBe('de');
        expect(pickSupportedLocale('uk_UA')).toBe('uk');
    });

    it('returns custom mapped codes for Chinese locales', () => {
        expect(pickSupportedLocale('zh_Hant')).toBe('zh-TW');
        expect(pickSupportedLocale('zh_HK')).toBe('zh-CN');
    });

    it('returns default locale code for unsupported languages', () => {
        const consoleSpy = jest.spyOn(console, 'warn');

        expect(pickSupportedLocale('aa')).toBe(DEFAULT_LOCALE);
        expect(consoleSpy).toHaveBeenCalledWith('Unsupported locale provided: "aa".');
    });
});
