import type { CultureRef } from '@prezly/sdk';
import { Culture } from '@prezly/sdk';

import { LANGUAGES } from '../__mocks__/languages';

import { getLanguageDisplayName } from './getLanguageDisplayName';

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
