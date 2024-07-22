import type { Category } from '@prezly/sdk';

import type { LocaleObject } from '../intl';
import type { IndexedCategoryRef } from '../types';

function isIndexedCategory(
    category: Pick<Category, 'i18n' | 'display_name'> | IndexedCategoryRef,
): category is IndexedCategoryRef {
    return 'name' in category && 'slug' in category;
}

interface LocalizedCategoryData {
    description: string | null;
    name: string;
    slug: string | null;
}

export function getLocalizedCategoryData(
    category: Pick<Category, 'i18n' | 'display_name'> | IndexedCategoryRef,
    locale: LocaleObject,
): LocalizedCategoryData {
    if (isIndexedCategory(category)) {
        return {
            description: null,
            name: category.name,
            slug: category.slug,
        };
    }

    const targetLocaleCode = locale.toUnderscoreCode();

    const translations = Object.values(category.i18n).filter((translation) =>
        Boolean(translation.name),
    );

    const targetTranslation =
        translations.find((translation) => translation.locale.code === targetLocaleCode) ??
        translations.find((translation) => translation.name === category.display_name) ??
        translations[0];

    const { locale: _, ...localizedData } = targetTranslation;

    return localizedData;
}

export function getCategoryUrl(
    category: Pick<Category, 'i18n' | 'display_name'> | IndexedCategoryRef,
    locale: LocaleObject,
): string {
    const { slug } = getLocalizedCategoryData(category, locale);
    return `/category/${slug}`;
}

export function getCategoryHasTranslation(
    category: Pick<Category, 'i18n'>,
    locale: LocaleObject,
): boolean {
    const translation = category.i18n[locale.toUnderscoreCode()];
    return Boolean(translation && translation.name);
}
