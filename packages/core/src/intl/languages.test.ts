import { LANGUAGES } from './__mocks__/languages';
import {
    getDefaultLanguage,
    getLanguageByExactLocaleCode,
    getLanguageByNeutralLocaleCode,
    getLanguageByShortRegionCode,
    getUsedLanguages,
} from './languages';

describe('getDefaultLanguage', () => {
    it('returns the actual default language', () => {
        const languages = [LANGUAGES.en, LANGUAGES.fr];

        expect(getDefaultLanguage(languages)).toEqual(LANGUAGES.en);
    });

    it('returns the first language if no default language is set', () => {
        const languages = [LANGUAGES.nl_BE, LANGUAGES.nl_NL];

        expect(getDefaultLanguage(languages)).toEqual(LANGUAGES.nl_BE);
    });
});

describe('getUsedLanguages', () => {
    it('filters out languages with no published stories', () => {
        const languages = Object.values(LANGUAGES);
        const usedLanguages = getUsedLanguages(languages);

        expect(usedLanguages).toHaveLength(3);
        expect(usedLanguages.every(({ public_stories_count }) => public_stories_count > 0)).toBe(
            true,
        );
    });
});

describe('getLanguageByExactLocaleCode', () => {
    const languages = [LANGUAGES.nl_BE, LANGUAGES.en];

    it('returns a languages by its exact locale code', () => {
        expect(getLanguageByExactLocaleCode(languages, 'nl-BE')).toEqual(LANGUAGES.nl_BE);
        expect(getLanguageByExactLocaleCode(languages, 'en')).toEqual(LANGUAGES.en);
    });

    it('returns undefined when there is no langauge with exact locale code', () => {
        expect(getLanguageByExactLocaleCode(languages, 'nl')).toBe(undefined);
    });
});

describe('getLanguageByNeutralLocaleCode', () => {
    it('prefers used cultures', () => {
        const languages = [
            LANGUAGES.en,
            { ...LANGUAGES.nl_BE, public_stories_count: 0, stories_count: 0 },
            LANGUAGES.nl_NL,
        ];

        expect(getLanguageByNeutralLocaleCode(languages, 'nl')).toEqual(LANGUAGES.nl_NL);
    });

    it('returns first fitting culture from unused cultures', () => {
        const languages = [
            LANGUAGES.en,
            { ...LANGUAGES.nl_BE, public_stories_count: 0, stories_count: 0 },
            { ...LANGUAGES.nl_NL, public_stories_count: 0, stories_count: 0 },
        ];

        expect(getLanguageByNeutralLocaleCode(languages, 'nl')).toEqual(languages[1]);
    });
});

describe('getLanguageByShortRegionCode', () => {
    it('prefers used cultures', () => {
        const languages = [LANGUAGES.en, LANGUAGES.nl_BE, LANGUAGES.fr_BE];

        expect(getLanguageByShortRegionCode(languages, 'be')).toEqual(LANGUAGES.nl_BE);
    });

    it('returns first fitting culture from unused cultures', () => {
        const languages = [
            LANGUAGES.en,
            LANGUAGES.fr_BE,
            { ...LANGUAGES.nl_BE, public_stories_count: 0, stories_count: 0 },
        ];

        expect(getLanguageByShortRegionCode(languages, 'be')).toEqual(LANGUAGES.fr_BE);
    });
});
