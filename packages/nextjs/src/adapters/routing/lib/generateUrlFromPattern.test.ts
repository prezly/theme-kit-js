import { generateUrlFromPattern } from './generateUrlFromPattern';

describe('generateUrlFromPattern', () => {
    it('should generate a URL (without context)', () => {
        const href = generateUrlFromPattern('/:localeCode/media', {
            localeCode: 'en',
        });

        expect(href).toBe('/en/media');
    });

    it('should generate a URL with optional variables (without context)', () => {
        const href = generateUrlFromPattern('/(:localeSlug/)media', {
            localeSlug: '',
        });

        expect(href).toBe('/media');
    });

    it('should generate a URL based on the current locale', () => {
        const href = generateUrlFromPattern(
            '/(:localeSlug/)media',
            {},
            {
                locale: 'fr',
                locales: ['en', 'nl', 'fr'],
                defaultLocale: 'en',
            },
        );

        expect(href).toBe('/fr/media');
    });

    it('should generate a homepage URL based on the current locale', () => {
        const href = generateUrlFromPattern(
            '/(:localeSlug/)media',
            {},
            {
                locale: 'en',
                locales: ['en', 'nl', 'fr'],
                defaultLocale: 'en',
            },
        );

        expect(href).toBe('/media');
    });

    it('should generate a shortest possible locale slug', () => {
        const href = generateUrlFromPattern(
            '/(:localeSlug/)media',
            {},
            {
                locale: 'nl_BE',
                locales: ['en_US', 'nl_BE', 'fr_FR'],
                defaultLocale: 'en_US',
            },
        );

        expect(href).toBe('/nl/media');
    });
});
