import type { Category } from '@prezly/sdk';

export function getCategoryUrl(category: Category.Translation): string {
    const { slug } = category;
    return `/category/${slug}`;
}
