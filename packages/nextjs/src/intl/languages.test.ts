import { LANGUAGES } from '../__mocks__/languages';

import { matchLanguageByRequestedLocaleSlug } from './languages';
import { DUMMY_DEFAULT_LOCALE } from './locale';

const ALL_LANGUAGES = Object.values(LANGUAGES);

describe('matchLanguageByRequestedLocaleSlug', () => {
    it('returns default language when no locale code provided or when dummy locale provided', () => {
        expect(matchLanguageByRequestedLocaleSlug(ALL_LANGUAGES)).toEqual(LANGUAGES.en);
        expect(matchLanguageByRequestedLocaleSlug(ALL_LANGUAGES, DUMMY_DEFAULT_LOCALE)).toEqual(
            LANGUAGES.en,
        );
    });

    it('returns language by exact code first', () => {
        expect(matchLanguageByRequestedLocaleSlug(ALL_LANGUAGES, 'en')).toEqual(LANGUAGES.en);
    });

    it('returns language by region code second', () => {
        expect(matchLanguageByRequestedLocaleSlug(ALL_LANGUAGES, 'be')).toEqual(LANGUAGES.nl_BE);
        expect(matchLanguageByRequestedLocaleSlug(ALL_LANGUAGES, 'gb')).toEqual(LANGUAGES.en_GB);
    });

    it('returns language by neutral code third', () => {
        expect(
            matchLanguageByRequestedLocaleSlug(
                ALL_LANGUAGES.filter(({ code }) => code !== 'fr'),
                'fr',
            ),
        ).toEqual(LANGUAGES.fr_BE);
    });

    it('returns undefined when no language found', () => {
        expect(matchLanguageByRequestedLocaleSlug(ALL_LANGUAGES, 'zh-Hant')).toEqual(undefined);
    });

    it('returns correct language with same region', () => {
        const languages = [LANGUAGES.en_DE, LANGUAGES.de_DE];
        expect(matchLanguageByRequestedLocaleSlug(languages, 'de')).toEqual(LANGUAGES.de_DE);
        expect(matchLanguageByRequestedLocaleSlug(languages, 'en')).toEqual(LANGUAGES.en_DE);
    });

    it('should prefer default language', () => {
        const languages = [
            LANGUAGES.en_GB,
            { ...LANGUAGES.en_DE, is_default: true },
            LANGUAGES.de_DE,
        ];
        expect(matchLanguageByRequestedLocaleSlug(languages, 'en')?.code).toEqual('en_DE');
    });
});
