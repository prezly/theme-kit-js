import { LANGUAGES } from '../__mocks__/languages';
import { STORY } from '../__mocks__/story';

import {
    getCompanyInformation,
    getDefaultLanguage,
    getLanguageByExactLocaleCode,
    getLanguageByNeutralLocaleCode,
    getLanguageByShortRegionCode,
    getLanguageDisplayName,
    getLanguageFromNextLocaleIsoCode,
    getLanguageFromStory,
    getShortestLocaleCode,
    getUsedLanguages,
} from './languages';
import { DUMMY_DEFAULT_LOCALE } from './locale';
import { LocaleObject } from './localeObject';

const ALL_LANGUAGES = Object.values(LANGUAGES);

describe('getLanguageDisplayName', () => {
    it('returns shortened name when language is the only culture', () => {
        const languages = [LANGUAGES.en, LANGUAGES.fr];

        expect(getLanguageDisplayName(LANGUAGES.en, languages)).toBe('English');
        expect(getLanguageDisplayName(LANGUAGES.fr, languages)).toBe('Français');
    });

    it('returns full name when language is NOT the only culture', () => {
        const languages = [LANGUAGES.nl_BE, LANGUAGES.nl_NL];

        expect(getLanguageDisplayName(LANGUAGES.nl_BE, languages)).toBe('Nederlands (België)');
        expect(getLanguageDisplayName(LANGUAGES.nl_NL, languages)).toBe('Nederlands (Nederland)');
    });
});

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
        expect(getLanguageByExactLocaleCode(languages, LocaleObject.fromAnyCode('nl-BE'))).toEqual(
            LANGUAGES.nl_BE,
        );
        expect(getLanguageByExactLocaleCode(languages, LocaleObject.fromAnyCode('en'))).toEqual(
            LANGUAGES.en,
        );
    });

    it('returns undefined when there is no langauge with exact locale code', () => {
        expect(getLanguageByExactLocaleCode(languages, LocaleObject.fromAnyCode('nl'))).toBe(
            undefined,
        );
    });
});

describe('getLanguageByNeutralLocaleCode', () => {
    it('prefers default language', () => {
        const languages = [LANGUAGES.en_US, LANGUAGES.en];

        expect(getLanguageByNeutralLocaleCode(languages, LocaleObject.fromAnyCode('en'))).toEqual(
            LANGUAGES.en,
        );
    });

    it('prefers used cultures', () => {
        const languages = [
            LANGUAGES.en,
            { ...LANGUAGES.nl_BE, public_stories_count: 0, stories_count: 0 },
            LANGUAGES.nl_NL,
        ];

        expect(getLanguageByNeutralLocaleCode(languages, LocaleObject.fromAnyCode('nl'))).toEqual(
            LANGUAGES.nl_NL,
        );
    });

    it('returns first fitting culture from unused cultures', () => {
        const languages = [
            LANGUAGES.en,
            { ...LANGUAGES.nl_BE, public_stories_count: 0, stories_count: 0 },
            { ...LANGUAGES.nl_NL, public_stories_count: 0, stories_count: 0 },
        ];

        expect(getLanguageByNeutralLocaleCode(languages, LocaleObject.fromAnyCode('nl'))).toEqual(
            languages[1],
        );
    });
});

describe('getLanguageByShortRegionCode', () => {
    it('prefers default language', () => {
        const languages = [LANGUAGES.nl_BE, { ...LANGUAGES.fr_BE, is_default: true }];

        expect(getLanguageByShortRegionCode(languages, LocaleObject.fromAnyCode('be'))).toEqual(
            languages[1],
        );
    });

    it('prefers used cultures', () => {
        const languages = [LANGUAGES.en, LANGUAGES.nl_BE, LANGUAGES.fr_BE];

        expect(getLanguageByShortRegionCode(languages, LocaleObject.fromAnyCode('be'))).toEqual(
            LANGUAGES.nl_BE,
        );
    });

    it('returns first fitting culture from unused cultures', () => {
        const languages = [
            LANGUAGES.en,
            LANGUAGES.fr_BE,
            { ...LANGUAGES.nl_BE, public_stories_count: 0, stories_count: 0 },
        ];

        expect(getLanguageByShortRegionCode(languages, LocaleObject.fromAnyCode('be'))).toEqual(
            LANGUAGES.fr_BE,
        );
    });
});

describe('getLanguageFromNextLocaleIsoCode', () => {
    it('returns default language when no locale code provided or when dummy locale provided', () => {
        expect(getLanguageFromNextLocaleIsoCode(ALL_LANGUAGES)).toEqual(LANGUAGES.en);
        expect(getLanguageFromNextLocaleIsoCode(ALL_LANGUAGES, DUMMY_DEFAULT_LOCALE)).toEqual(
            LANGUAGES.en,
        );
    });

    it('returns language by exact code first', () => {
        expect(getLanguageFromNextLocaleIsoCode(ALL_LANGUAGES, 'en')).toEqual(LANGUAGES.en);
    });

    it('returns language by neutral code second', () => {
        expect(getLanguageFromNextLocaleIsoCode(ALL_LANGUAGES, 'nl')).toEqual(LANGUAGES.nl_BE);
    });

    it('returns language by region code thrid', () => {
        expect(getLanguageFromNextLocaleIsoCode(ALL_LANGUAGES, 'us')).toEqual(LANGUAGES.en_US);
    });

    it('returns undefined when no language found', () => {
        expect(getLanguageFromNextLocaleIsoCode(ALL_LANGUAGES, 'zh-Hant')).toEqual(undefined);
    });
});

describe('getLanguageFromStory', () => {
    it('correctly returns language from a story', () => {
        expect(getLanguageFromStory(ALL_LANGUAGES, STORY)).toEqual(LANGUAGES.en);
    });
});

describe('getCompanyInformation', () => {
    it('returns company information from target language', () => {
        expect(getCompanyInformation(ALL_LANGUAGES, LocaleObject.fromAnyCode('nl-BE'))).toEqual(
            LANGUAGES.nl_BE.company_information,
        );
    });

    it('returns company information from default language if target not found', () => {
        expect(getCompanyInformation(ALL_LANGUAGES, LocaleObject.fromAnyCode('de-DE'))).toEqual(
            LANGUAGES.en.company_information,
        );
    });
});

describe('getShortestLocaleCode', () => {
    it('returns false for default language', () => {
        expect(getShortestLocaleCode(ALL_LANGUAGES, LocaleObject.fromAnyCode('en'))).toBe(false);
    });

    it('returns neutral language code if it is the only culture with that language', () => {
        expect(getShortestLocaleCode(ALL_LANGUAGES, LocaleObject.fromAnyCode('es-ES'))).toBe('es');
    });

    it('returns region code if it is the only culture with that region', () => {
        expect(getShortestLocaleCode(ALL_LANGUAGES, LocaleObject.fromAnyCode('en-US'))).toBe('US');
        expect(getShortestLocaleCode(ALL_LANGUAGES, LocaleObject.fromAnyCode('en-GB'))).toBe('GB');
        expect(getShortestLocaleCode(ALL_LANGUAGES, LocaleObject.fromAnyCode('nl-NL'))).toBe('NL');
        expect(getShortestLocaleCode(ALL_LANGUAGES, LocaleObject.fromAnyCode('fr'))).toBe('FR');
    });

    it('returns full code if it can not be shortened', () => {
        expect(getShortestLocaleCode(ALL_LANGUAGES, LocaleObject.fromAnyCode('fr-BE'))).toBe(
            'fr_BE',
        );
        expect(getShortestLocaleCode(ALL_LANGUAGES, LocaleObject.fromAnyCode('nl-BE'))).toBe(
            'nl_BE',
        );
    });
});
