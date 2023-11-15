import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';

import type { AlgoliaCategoryRef } from './types';

function isAlgoliaCategory(
    category: Pick<Category, 'i18n' | 'display_name'> | AlgoliaCategoryRef,
): category is AlgoliaCategoryRef {
    return 'name' in category && 'slug' in category;
}

interface LocalizedCategoryData {
    description: string | null;
    name: string;
    slug: string | null;
}

export function getLocalizedData(
    category: Pick<Category, 'i18n' | 'display_name'> | AlgoliaCategoryRef,
    locale: Locale.Code,
): LocalizedCategoryData {
    if (isAlgoliaCategory(category)) {
        return {
            description: null,
            name: category.name,
            slug: category.slug,
        };
    }

    const translations = Object.values(category.i18n).filter((translation) => translation.name);

    const pickedTranslation =
        translations.find((translation) => translation.locale.code === locale) ??
        translations.find((translation) => translation.name === category.display_name) ??
        translations[0];

    const { name, slug, description } = pickedTranslation;

    return { name, slug, description };
}
