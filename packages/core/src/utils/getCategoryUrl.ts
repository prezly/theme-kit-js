import type { TranslatedCategory } from '@prezly/sdk';

export function getCategoryUrl(category: TranslatedCategory): string {
    const { slug } = category;
    return `/category/${slug}`;
}
