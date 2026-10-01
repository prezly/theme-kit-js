import type {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
} from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';

import { generateCategoryPageMetadata } from './generateCategoryPageMetadata';
import type { AbsoluteUrlGenerator } from './types';

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
                    description: 'Contact our team',
                    slug,
                    public_stories_number: count,
                } as Category.Translation,
            ]),
        ),
    };
}

function metadata(
    value: Category,
    languages: Locale.Code[] = ['en', 'fr', 'ja_JP'],
    locale: Locale.Code = 'en',
) {
    const generateUrl: AbsoluteUrlGenerator = (_route, params) =>
        `https://example.com/${params.localeCode}/category/${'slug' in params ? params.slug : ''}`;

    return generateCategoryPageMetadata({
        category: value,
        locale,
        newsroom: { uuid: 'newsroom', display_name: 'Newsroom' } as Newsroom,
        companyInformation: { name: 'Company' } as NewsroomCompanyInformation,
        languages: languages.map(
            (code) => ({ code, is_default: code === 'fr' }) as NewsroomLanguageSettings,
        ),
        generateUrl: () => generateUrl,
    });
}

describe('generateCategoryPageMetadata', () => {
    it('omits empty translations and their language aliases while preserving the canonical', async () => {
        const result = await metadata(category(0));

        expect(result.title).toBe('Contacts');
        expect(result.description).toBe('Contact our team');
        expect(result.alternates).toEqual({
            canonical: 'https://example.com/en/category/contacts',
            languages: {
                en: 'https://example.com/en/category/contacts',
                fr: 'https://example.com/fr/category/contacter',
                'x-default': 'https://example.com/en/category/contacts',
            },
        });
    });

    it('includes Japanese and its alias when the translation has a public story', async () => {
        const result = await metadata(category(1));

        expect(result.alternates?.languages).toMatchObject({
            ja: 'https://example.com/ja_JP/category/contacts-ja',
            'ja-JP': 'https://example.com/ja_JP/category/contacts-ja',
        });
    });

    it('omits missing and disabled translations', async () => {
        const result = await metadata(category(1), ['en', 'de']);

        expect(result.alternates?.languages).toEqual({
            en: 'https://example.com/en/category/contacts',
            'x-default': 'https://example.com/en/category/contacts',
        });
    });

    it('uses a populated default language when the English category is empty', async () => {
        const value = category(0);
        value.i18n.en.public_stories_number = 0;
        const result = await metadata(value, ['en', 'fr', 'ja_JP'], 'fr');

        expect(result.alternates).toEqual({
            canonical: 'https://example.com/fr/category/contacter',
            languages: {
                fr: 'https://example.com/fr/category/contacter',
                'x-default': 'https://example.com/fr/category/contacter',
            },
        });
    });
});
