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
            localeCode: '',
        });

        expect(href).toBe('/media');
    });

    it('should generate a shortest possible locale slug', () => {
        const href = generateUrlFromPattern(
            '/(:localeSlug/)media',
            { localeCode: 'nl_BE' },
            {
                defaultLocale: 'en_US',
                locales: ['en_US', 'nl_BE', 'fr_FR'],
            },
        );

        expect(href).toBe('/nl/media');
    });
});
