import { LANGUAGES } from '../__mocks__/languages';

import { DUMMY_DEFAULT_LOCALE } from './getRedirectToCanonicalLocale';
import { matchLanguageFromNextLocale } from './matchLanguageFromNextLocale';

const ALL_LANGUAGES = Object.values(LANGUAGES);

describe('matchLanguageFromNextLocale', () => {
    it('returns default language when no locale code provided or when dummy locale provided', () => {
        expect(matchLanguageFromNextLocale(undefined, ALL_LANGUAGES)).toEqual(LANGUAGES.en);
        expect(matchLanguageFromNextLocale(DUMMY_DEFAULT_LOCALE, ALL_LANGUAGES)).toEqual(
            LANGUAGES.en,
        );
    });

    it('returns language by exact code first', () => {
        expect(matchLanguageFromNextLocale('en', ALL_LANGUAGES)).toEqual(LANGUAGES.en);
    });

    it('returns language by region code second', () => {
        expect(matchLanguageFromNextLocale('be', ALL_LANGUAGES)).toEqual(LANGUAGES.nl_BE);
        expect(matchLanguageFromNextLocale('nl', ALL_LANGUAGES)).toEqual(LANGUAGES.nl_NL);
    });

    it('returns language by neutral code third', () => {
        expect(
            matchLanguageFromNextLocale(
                'fr',
                ALL_LANGUAGES.filter(({ code }) => code !== 'fr'),
            ),
        ).toEqual(LANGUAGES.fr_BE);
    });

    it('returns undefined when no language found', () => {
        expect(matchLanguageFromNextLocale('zh-Hant', ALL_LANGUAGES)).toEqual(undefined);
    });

    it('returns correct language with same region', () => {
        const languages = [LANGUAGES.en_DE, LANGUAGES.de_DE];
        expect(matchLanguageFromNextLocale('de', languages)).toEqual(LANGUAGES.de_DE);
        expect(matchLanguageFromNextLocale('en', languages)).toEqual(LANGUAGES.en_DE);
    });

    it('should exclude default language from checks', () => {
        const languages = [{ ...LANGUAGES.en_DE, is_default: true }, LANGUAGES.de_DE];
        expect(matchLanguageFromNextLocale('en', languages)).toEqual(undefined);
    });
});
