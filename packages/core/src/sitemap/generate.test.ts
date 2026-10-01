import type { Category, Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';

import { generate } from './generate';
import { stringify } from './stringify';

function category(japaneseStories: number): Category {
    return {
        id: 1,
        display_name: 'Contacts',
        display_description: null,
        stories_number: 5 + japaneseStories,
        public_stories_number: 5 + japaneseStories,
        image: null,
        is_featured: false,
        i18n: Object.fromEntries(
            [
                ['en', 'contacts', 3],
                ['fr', 'contacter', 2],
                ['ja_JP', 'contacts-ja', japaneseStories],
            ].map(([code, slug, count]) => [
                code,
                {
                    locale: { code },
                    name: 'Contacts',
                    description: null,
                    slug,
                    public_stories_number: count,
                } as Category.Translation,
            ]),
        ),
    };
}

function sitemap(value: Category, locales: Locale.Code[] = ['en', 'fr', 'ja_JP']) {
    return generate(
        {
            categories: [value],
            locales,
            newsroom: { public_galleries_number: 0 } as Newsroom,
            stories: [],
            generateUrl: (route, params) =>
                route === 'category' && 'slug' in params
                    ? `https://example.com/${params.localeCode}/category/${params.slug}`
                    : undefined,
        },
        { baseUrl: 'https://example.com' },
    );
}

describe('category sitemap entries', () => {
    it('omits empty translations from both URL entries and alternate links', async () => {
        const result = await sitemap(category(0));

        expect(result).toEqual([
            {
                url: 'https://example.com/en/category/contacts',
                priority: 0.8,
                changeFrequency: 'weekly',
                alternate: [{ lang: 'fr', url: 'https://example.com/fr/category/contacter' }],
            },
            {
                url: 'https://example.com/fr/category/contacter',
                priority: 0.8,
                changeFrequency: 'weekly',
                alternate: [{ lang: 'en', url: 'https://example.com/en/category/contacts' }],
            },
        ]);
        expect(stringify(result)).not.toContain('/ja_JP/category/');
    });

    it('includes a translation once it has a public story', async () => {
        const result = await sitemap(category(1));

        expect(result.map(({ url }) => url)).toContain(
            'https://example.com/ja_JP/category/contacts-ja',
        );
        expect(result[0].alternate).toContainEqual({
            lang: 'ja-JP',
            url: 'https://example.com/ja_JP/category/contacts-ja',
        });
    });

    it('omits missing and disabled translations', async () => {
        const result = await sitemap(category(1), ['en', 'de']);

        expect(result).toEqual([
            {
                url: 'https://example.com/en/category/contacts',
                priority: 0.8,
                changeFrequency: 'weekly',
                alternate: [],
            },
        ]);
    });

    it('omits a category when every enabled translation is empty', async () => {
        expect(await sitemap(category(0), ['ja_JP'])).toEqual([]);
    });
});
