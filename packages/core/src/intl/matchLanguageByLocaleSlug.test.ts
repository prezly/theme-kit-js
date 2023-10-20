/* eslint-disable @typescript-eslint/naming-convention */
import { LANGUAGES } from '../__mocks__/languages';

import { matchLanguageByLocaleSlug } from './matchLanguageByLocaleSlug';

describe('matchLanguageByLocaleSlug', () => {
    it('should match enabled languages by full locale slug', () => {
        const languages = [LANGUAGES.nl_BE, LANGUAGES.nl_NL, LANGUAGES.en];

        expect(matchLanguageByLocaleSlug(languages, 'nl-be')).toBe(LANGUAGES.nl_BE);
        expect(matchLanguageByLocaleSlug(languages, 'nl-nl')).toBe(LANGUAGES.nl_NL);
        expect(matchLanguageByLocaleSlug(languages, 'en')).toBe(LANGUAGES.en);
    });

    it('should return undefined if no active language matches locale slug', () => {
        const languages = [LANGUAGES.nl_BE, LANGUAGES.nl_NL, LANGUAGES.en];

        expect(matchLanguageByLocaleSlug(languages, 'fr-be')).toBeUndefined();
        expect(matchLanguageByLocaleSlug(languages, 'en-us')).toBeUndefined();
        expect(matchLanguageByLocaleSlug(languages, 'de-de')).toBeUndefined();
    });

    it('should match language by lang code slug', () => {
        const languages = [LANGUAGES.nl_BE, LANGUAGES.en_US, LANGUAGES.fr_BE];

        expect(matchLanguageByLocaleSlug(languages, 'nl')).toBe(LANGUAGES.nl_BE);
        expect(matchLanguageByLocaleSlug(languages, 'fr')).toBe(LANGUAGES.fr_BE);
        expect(matchLanguageByLocaleSlug(languages, 'en')).toBe(LANGUAGES.en_US);
    });

    it('should match language by region code slug', () => {
        const languages = [LANGUAGES.nl_BE, LANGUAGES.en_GB, LANGUAGES.en_US];

        expect(matchLanguageByLocaleSlug(languages, 'be')).toBe(LANGUAGES.nl_BE);
        expect(matchLanguageByLocaleSlug(languages, 'gb')).toBe(LANGUAGES.en_GB);
        expect(matchLanguageByLocaleSlug(languages, 'us')).toBe(LANGUAGES.en_US);
    });

    it('should never match language by number-only region code slug', () => {
        const languages = [LANGUAGES.es_ES, LANGUAGES.es_419];

        expect(matchLanguageByLocaleSlug(languages, '419')).toBeUndefined();
    });

    it('should prefer default language if multiple languages match against shortened lang code', () => {
        const languages = {
            nl_BE: { ...LANGUAGES.nl_BE, is_default: false },
            en_US: { ...LANGUAGES.en_US, is_default: false },
            en_GB: { ...LANGUAGES.en_GB, is_default: true },
        };

        expect(matchLanguageByLocaleSlug(Object.values(languages), 'en')).toBe(languages.en_GB);
    });

    it('should prefer used languages if multiple non-default languages match against shortened lang code', () => {
        const languages = {
            nl_BE: { ...LANGUAGES.nl_BE, is_default: true },
            en_GB: { ...LANGUAGES.en_GB, is_default: false, public_stories_count: 0 },
            en_US: { ...LANGUAGES.en_US, is_default: false, public_stories_count: 1 },
        };

        expect(matchLanguageByLocaleSlug(Object.values(languages), 'en')).toBe(languages.en_US);
    });

    it('should pick any languages if multiple non-default non-used languages match against shortened lang code', () => {
        const languages = {
            nl_BE: { ...LANGUAGES.nl_BE, is_default: true },
            en_GB: { ...LANGUAGES.en_GB, is_default: false, public_stories_count: 0 },
            en_US: { ...LANGUAGES.en_US, is_default: false, public_stories_count: 0 },
        };

        expect([languages.en_GB, languages.en_US]).toContain(
            matchLanguageByLocaleSlug(Object.values(languages), 'en'),
        );
    });
});
