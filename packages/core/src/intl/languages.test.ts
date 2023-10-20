import { expect } from '@playwright/test';
import type { CultureRef } from '@prezly/sdk';
import { Culture } from '@prezly/sdk';

import { LANGUAGES } from '../__mocks__/languages';
import { STORY } from '../__mocks__/story';

import {
    getCompanyInformation,
    getDefaultLanguage,
    getLanguageByExactLocaleCode,
    getLanguageByNeutralLocaleCode,
    getLanguageByShortRegionCode,
    getLanguageDisplayName,
    getLanguageFromStory,
    getShortestLocaleSlug,
    getUsedLanguages,
} from './languages';

const ALL_LANGUAGES = Object.values(LANGUAGES);

describe('getLanguageDisplayName', () => {
    it('should return shortened name when language is the only culture', () => {
        const languages = [LANGUAGES.en, LANGUAGES.fr];

        expect(getLanguageDisplayName(LANGUAGES.en, languages)).toBe('English');
        expect(getLanguageDisplayName(LANGUAGES.fr, languages)).toBe('Français');
    });

    it('should return full name when language is NOT the only culture', () => {
        const languages = [LANGUAGES.nl_BE, LANGUAGES.nl_NL];

        expect(getLanguageDisplayName(LANGUAGES.nl_BE, languages)).toBe('Nederlands (België)');
        expect(getLanguageDisplayName(LANGUAGES.nl_NL, languages)).toBe('Nederlands (Nederland)');
    });

    it('should properly cut region from an RTL language name', () => {
        const languages = [
            {
                locale: {
                    code: 'ar_AE',
                    locale: 'ar_AE',
                    language_code: 'ar',
                    name: 'Arabic (UAE)',
                    native_name: 'العربية (الإمارات العربية المتحدة)',
                    direction: Culture.TextDirection.RTL,
                } satisfies CultureRef,
            },
        ];

        expect(getLanguageDisplayName(languages[0], languages)).toBe('العربية');
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

describe('getLanguageFromStory', () => {
    it('correctly returns language from a story', () => {
        expect(getLanguageFromStory(ALL_LANGUAGES, STORY)).toEqual(LANGUAGES.en);
    });
});

describe('getCompanyInformation', () => {
    it('returns company information from target language', () => {
        expect(getCompanyInformation(ALL_LANGUAGES, 'nl-BE')).toEqual(
            LANGUAGES.nl_BE.company_information,
        );
    });

    it('returns company information from default language if target not found', () => {
        expect(getCompanyInformation(ALL_LANGUAGES, 'de-DE')).toEqual(
            LANGUAGES.en.company_information,
        );
    });
});

describe('getShortestLocaleSlug', () => {
    it('returns false for default language', () => {
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'en')).toBe(false);
    });

    it('returns neutral language code if it is the only culture with that language', () => {
        expect(
            getShortestLocaleSlug(
                ALL_LANGUAGES.filter(({ code }) => code !== 'es_419'),
                'es-ES',
            ),
        ).toBe('es');
    });

    it('returns region code if it is the only culture with that region', () => {
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'en-US')).toBe('us');
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'en-GB')).toBe('gb');
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'nl-NL')).toBe('nl-nl'); // cannot use `nl`, as it collides with language code
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'fr')).toBe('fr');
    });

    it('returns full code if it can not be shortened', () => {
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'fr-BE')).toBe('fr-be');
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'nl-BE')).toBe('nl-be');
    });

    it('returns full code when trying to shorten to region code for es-419', () => {
        expect(getShortestLocaleSlug(ALL_LANGUAGES, 'es-419')).toBe('es-419');
    });
});
