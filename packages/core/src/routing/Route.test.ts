import { Route } from './Route';

describe('generate()', () => {
    it('should generate URLs with non-ascii characters', () => {
        const route = Route.create('/:slug', '/');

        expect(route.generate({ slug: '年春夏コレクション' })).toBe(
            '/%E5%B9%B4%E6%98%A5%E5%A4%8F%E3%82%B3%E3%83%AC%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3',
        );
    });
});

describe('a named wildcard', () => {
    const route = Route.create('(/:localeSlug)/category/*path', '/:localeCode/category/*path');

    it('should match every segment that is left', () => {
        const search = new URLSearchParams();

        expect(route.match('/category/cars', search)).toEqual({ path: 'cars' });
        expect(route.match('/category/cars/models/eqs', search)).toEqual({
            path: 'cars/models/eqs',
        });
        expect(route.match('/fr/category/cars/models', search)).toEqual({
            localeSlug: 'fr',
            path: 'cars/models',
        });
    });

    it('should not match without anything in the wildcard', () => {
        const search = new URLSearchParams();

        expect(route.match('/category', search)).toBeUndefined();
        expect(route.match('/category/', search)).toBeUndefined();
    });

    it('should generate URLs keeping the slashes between segments', () => {
        expect(route.generate({ path: 'cars/models/eqs' })).toBe('/category/cars/models/eqs');
        expect(route.generate({ localeSlug: 'fr', path: 'voitures/événements' })).toBe(
            '/fr/category/voitures/%C3%A9v%C3%A9nements',
        );
    });

    it('should let a custom generate() stringify the wildcard by its name', () => {
        const custom = Route.create('/category/*path', '/:localeCode/category/*path', {
            generate(pattern, params) {
                return `${pattern.stringify(params)}?preview` as `/${string}`;
            },
        });

        expect(custom.generate({ path: 'cars/models/eqs' })).toBe(
            '/category/cars/models/eqs?preview',
        );
    });

    it('should rewrite to the internal URL', () => {
        expect(route.rewrite({ localeCode: 'en', path: 'cars/models/eqs' } as never)).toBe(
            '/en/category/cars/models/eqs',
        );
    });
});
