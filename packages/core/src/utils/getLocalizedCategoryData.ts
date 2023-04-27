import type { Category } from '@prezly/sdk';

import type { LocaleObject } from '../intl';
import type { AlgoliaCategoryRef } from '../types';

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

export function getLocalizedCategoryData(
    category: Pick<Category, 'i18n' | 'display_name'> | AlgoliaCategoryRef,
    locale: LocaleObject,
): LocalizedCategoryData {
    if (isAlgoliaCategory(category)) {
        return {
            description: null,
            name: category.name,
            slug: category.slug,
        };
    }

    const targetLocaleCode = locale.toUnderscoreCode();
    const { i18n } = category;
    const populatedLocales = Object.keys(i18n).filter((localeCode) => i18n[localeCode].name);
    const targetLocale =
        populatedLocales.find((localeCode) => localeCode === targetLocaleCode) ||
        populatedLocales.find((localeCode) => i18n[localeCode].name === category.display_name) ||
        populatedLocales[0];

    const { locale: _, ...localizedData } = i18n[targetLocale];

    return localizedData;
}

export function getCategoryUrl(
    category: Pick<Category, 'i18n' | 'display_name'> | AlgoliaCategoryRef,
    locale: LocaleObject,
): string {
    const { slug } = getLocalizedCategoryData(category, locale);
    return `/category/${slug}`;
}

export function getCategoryHasTranslation(
    category: Pick<Category, 'i18n'>,
    locale: LocaleObject,
): boolean {
    const targetLocaleCode = locale.toUnderscoreCode();
    const { i18n } = category;
    const populatedLocales = Object.keys(i18n).filter((localeCode) => i18n[localeCode].name);
    return Boolean(populatedLocales.find((localeCode) => localeCode === targetLocaleCode));
}
