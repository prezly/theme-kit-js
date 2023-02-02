import { getAlternateLanguageLinks } from './getAlternateLanguageLinks';

describe('getAlternateLanguageLinks', () => {
    it('test', () => {
        const res = getAlternateLanguageLinks(
            [
                { code: 'en-US' },
                { code: 'en-GB' },
                { code: 'fr-FR' },
                { code: 'fr', is_default: true },
            ] as any,
            (locale) => `translationUrl/${locale.toHyphenCode()}`,
            (locale, translationUrl) =>
                `http://localhost:3000/${locale.toNeutralLanguageCode()}/${translationUrl}`,
        );

        console.log(res);

        expect(true).toBe(true);
    });
});
