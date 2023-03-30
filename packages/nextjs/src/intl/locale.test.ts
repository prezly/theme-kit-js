import { DUMMY_DEFAULT_LOCALE, getRedirectToCanonicalLocale } from './locale';

describe('getRedirectToCanonicalLocale', () => {
    it('returns undefined when no locale or dummy locale is provided', () => {
        expect(getRedirectToCanonicalLocale('en', undefined, '/')).toBe(undefined);
        expect(getRedirectToCanonicalLocale('en', DUMMY_DEFAULT_LOCALE, '/')).toBe(undefined);
    });

    it('returns undefined when locale is already canonical', () => {
        expect(getRedirectToCanonicalLocale('en', 'en', '/')).toBe(undefined);
        expect(getRedirectToCanonicalLocale('nl_BE', 'nl-be', '/')).toBe(undefined);
    });

    it('returns a redirect object when requested locale is not canonical', () => {
        expect(getRedirectToCanonicalLocale(false, 'en-us', '/test')).toEqual({
            destination: '/test',
            permanent: false,
        });

        expect(getRedirectToCanonicalLocale('en', 'en-us', '/test')).toEqual({
            destination: '/en/test',
            permanent: false,
        });

        expect(getRedirectToCanonicalLocale('en', 'en-us', 'test')).toEqual({
            destination: '/en/test',
            permanent: false,
        });
    });

    it('preserves query parameters', () => {
        expect(
            getRedirectToCanonicalLocale('en', 'en-us', '/test', {
                page: '1',
                tags: ['story', 'media'],
            }),
        ).toEqual({
            destination: '/en/test?page=1&tags=story&tags=media',
            permanent: false,
        });
    });
});
