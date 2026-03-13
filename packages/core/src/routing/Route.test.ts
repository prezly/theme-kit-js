import { Route } from './Route';

describe('generate()', () => {
    it('should generate URLs with non-ascii characters', () => {
        const route = Route.create('/:slug', '/');

        expect(route.generate({ slug: '年春夏コレクション' })).toBe(
            '/%E5%B9%B4%E6%98%A5%E5%A4%8F%E3%82%B3%E3%83%AC%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3',
        );
    });
});
