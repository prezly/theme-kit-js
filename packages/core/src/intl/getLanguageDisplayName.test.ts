import type { Culture, CultureRef } from '@prezly/sdk';

import { LANGUAGES } from '../__mocks__/languages';

import { getLanguageDisplayName } from './getLanguageDisplayName';

describe('getLanguageDisplayName', () => {
    describe('with languages as input', () => {
        it('should return shortened name when language is the only culture', () => {
            const languages = [LANGUAGES.en, LANGUAGES.fr];

            expect(getLanguageDisplayName(LANGUAGES.en, languages)).toBe('English');
            expect(getLanguageDisplayName(LANGUAGES.fr, languages)).toBe('Français');
        });

        it('should return full name when language is NOT the only culture', () => {
            const languages = [LANGUAGES.nl_BE, LANGUAGES.nl_NL];

            expect(getLanguageDisplayName(LANGUAGES.nl_BE, languages)).toBe('Nederlands (België)');
            expect(getLanguageDisplayName(LANGUAGES.nl_NL, languages)).toBe(
                'Nederlands (Nederland)',
            );
        });

        it('should properly cut region from an RTL language name', () => {
            const languages = [
                {
                    locale: {
                        code: 'ar_AE',
                        native_name: 'العربية (الإمارات العربية المتحدة)',
                    } satisfies Pick<CultureRef, 'code' | 'native_name'>,
                },
            ];

            expect(getLanguageDisplayName(languages[0], languages)).toBe('العربية');
        });
    });

    describe('with locales as input', () => {
        it('should return shortened name when language is the only culture', () => {
            const locales = [LANGUAGES.en.locale, LANGUAGES.fr.locale];

            expect(getLanguageDisplayName(LANGUAGES.en.locale, locales)).toBe('English');
            expect(getLanguageDisplayName(LANGUAGES.fr.locale, locales)).toBe('Français');
        });

        it('should return full name when language is NOT the only culture', () => {
            const locales = [LANGUAGES.nl_BE.locale, LANGUAGES.nl_NL.locale];

            expect(getLanguageDisplayName(LANGUAGES.nl_BE.locale, locales)).toBe(
                'Nederlands (België)',
            );
            expect(getLanguageDisplayName(LANGUAGES.nl_NL.locale, locales)).toBe(
                'Nederlands (Nederland)',
            );
        });

        it('should properly cut region from an RTL language name', () => {
            const locales = [
                {
                    code: 'ar_AE',
                    native_name: 'العربية (الإمارات العربية المتحدة)',
                } satisfies Pick<Culture, 'code' | 'native_name'>,
            ];

            expect(getLanguageDisplayName(locales[0], locales)).toBe('العربية');
        });
    });

    describe('with English labels', () => {
        it('should return shortened name when language is the only culture', () => {
            const locales = [LANGUAGES.en.locale, LANGUAGES.fr.locale];

            expect(getLanguageDisplayName(LANGUAGES.en.locale, locales, 'english')).toBe('English');
            expect(getLanguageDisplayName(LANGUAGES.fr.locale, locales, 'english')).toBe('French');
        });
    });
});
