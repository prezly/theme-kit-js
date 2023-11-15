import { LANGUAGES } from './__mocks__/languages';
import { getDefaultLanguage, getLanguageByExactLocaleCode, getUsedLanguages } from './languages';

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
