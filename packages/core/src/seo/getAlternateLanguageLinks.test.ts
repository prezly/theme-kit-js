import { Locale } from '@prezly/theme-kit-intl';

import { getAlternateLanguageLinks } from './getAlternateLanguageLinks';

function lang(code: Locale.Code, isDefault = false) {
    return { code, is_default: isDefault };
}

function getTranslationUrl(locale: Locale | Locale.AnyCode) {
    const { isoCode } = Locale.from(locale);
    return `translationUrl/${isoCode}`;
}

function generateTranslationUrl(locale: Locale | Locale.AnyCode) {
    const translationUrl = getTranslationUrl(locale);
    const { lang: langCode } = Locale.from(locale);

    return `http://localhost:3000/${langCode}/${translationUrl}`;
}

describe('getAlternateLanguageLinks', () => {
    it('should handle one en-GB non-default language', () => {
        const links = getAlternateLanguageLinks([lang('en-GB')], generateTranslationUrl);

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en-GB' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'x-default' },
        ]);
    });

    it('should handle one en-GB default language', () => {
        const links = getAlternateLanguageLinks([lang('en-GB', true)], generateTranslationUrl);

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en-GB' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'x-default' },
        ]);
    });

    it('should handle two full locales', () => {
        const links = getAlternateLanguageLinks(
            [lang('en-GB', true), lang('fr-FR')],
            generateTranslationUrl,
        );

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en-GB' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'fr' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'fr-FR' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'x-default' },
        ]);
    });

    it('should use en-GB locale as x-default even if other locale is set as default', () => {
        const links = getAlternateLanguageLinks(
            [lang('en-GB'), lang('fr-FR', true)],
            generateTranslationUrl,
        );

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en-GB' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'fr' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'fr-FR' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'x-default' },
        ]);
    });

    it('should use default locale as x-default when there is eng locale', () => {
        const links = getAlternateLanguageLinks(
            [lang('ru-RU'), lang('fr-FR', true)],
            generateTranslationUrl,
        );

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'fr' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'fr-FR' },
            { href: 'http://localhost:3000/ru/translationUrl/ru-RU', hrefLang: 'ru' },
            { href: 'http://localhost:3000/ru/translationUrl/ru-RU', hrefLang: 'ru-RU' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'x-default' },
        ]);
    });

    it('should include provided region independent locale', () => {
        const links = getAlternateLanguageLinks(
            [lang('en-US'), lang('fr'), lang('fr-FR', true)],
            generateTranslationUrl,
        );

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'en' },
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'en-US' },
            { href: 'http://localhost:3000/fr/translationUrl/fr', hrefLang: 'fr' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'fr-FR' },
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'x-default' },
        ]);
    });

    it('should use provided en region independent locale as x-default', () => {
        const links = getAlternateLanguageLinks(
            [lang('en'), lang('en-US'), lang('fr'), lang('fr-FR')],
            generateTranslationUrl,
        );

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/en/translationUrl/en', hrefLang: 'en' },
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'en-US' },
            { href: 'http://localhost:3000/fr/translationUrl/fr', hrefLang: 'fr' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'fr-FR' },
            { href: 'http://localhost:3000/en/translationUrl/en', hrefLang: 'x-default' },
        ]);
    });

    it('should fallback en link to en-US locale when there is en-GB locale', () => {
        const links = getAlternateLanguageLinks(
            [lang('en-GB'), lang('en-US')],
            generateTranslationUrl,
        );

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'en' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en-GB' },
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'en-US' },
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'x-default' },
        ]);
    });

    it('should should omit locales if getTranslationUrl is undefined', () => {
        const links = getAlternateLanguageLinks(
            [lang('en-US'), lang('fr'), lang('fr-FR', true)],
            (locale) => {
                const translationUrl = Locale.isEqual(locale, 'en-US')
                    ? undefined
                    : getTranslationUrl(locale);

                if (translationUrl) {
                    return generateTranslationUrl(locale);
                }

                return undefined;
            },
        );

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/fr/translationUrl/fr', hrefLang: 'fr' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'fr-FR' },
            { href: 'http://localhost:3000/fr/translationUrl/fr-FR', hrefLang: 'x-default' },
        ]);
    });

    it('should should not duplicate links when equal languages passed', () => {
        const links = getAlternateLanguageLinks(
            [lang('en-GB'), lang('en-GB'), lang('en-US'), lang('en-US')],
            generateTranslationUrl,
        );

        expect(links).toMatchObject([
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'en' },
            { href: 'http://localhost:3000/en/translationUrl/en-GB', hrefLang: 'en-GB' },
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'en-US' },
            { href: 'http://localhost:3000/en/translationUrl/en-US', hrefLang: 'x-default' },
        ]);
    });
});
