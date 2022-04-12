import type { Category, Story } from '@prezly/sdk';

export function createPaths(stories: Story[], categories: Category[]) {
    const storiesUrls = stories.map(({ slug }) => `/${slug}`);
    const categoriesUrls = categories
        .map((category) => {
            const translations = Object.values(category.i18n);
            const allSlugs = translations
                .map(({ slug }) => slug || '')
                .filter(Boolean)
                .reduce(
                    (slugs, slug) => (slugs.includes(slug) ? [...slugs] : [...slugs, slug]),
                    [] as string[],
                );

            return allSlugs.map((slug) => `/category/${slug}`);
        })
        .flat();

    return [...storiesUrls, ...categoriesUrls];
}
