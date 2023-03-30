import { LANGUAGES } from '../__mocks__/languages';

import { getLanguageFromNextLocaleIsoCode } from './languages';
import { DUMMY_DEFAULT_LOCALE } from './locale';

const ALL_LANGUAGES = Object.values(LANGUAGES);

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

    it('returns language by region code second', () => {
        expect(getLanguageFromNextLocaleIsoCode(ALL_LANGUAGES, 'be')).toEqual(LANGUAGES.nl_BE);
        expect(getLanguageFromNextLocaleIsoCode(ALL_LANGUAGES, 'nl')).toEqual(LANGUAGES.nl_NL);
    });

    it('returns language by neutral code thrid', () => {
        expect(
            getLanguageFromNextLocaleIsoCode(
                ALL_LANGUAGES.filter(({ code }) => code !== 'fr'),
                'fr',
            ),
        ).toEqual(LANGUAGES.fr_BE);
    });

    it('returns undefined when no language found', () => {
        expect(getLanguageFromNextLocaleIsoCode(ALL_LANGUAGES, 'zh-Hant')).toEqual(undefined);
    });
});