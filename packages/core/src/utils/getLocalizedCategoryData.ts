import type { Category } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

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
    locale: Locale | Locale.AnyCode,
): LocalizedCategoryData {
    if (isAlgoliaCategory(category)) {
        return {
            description: null,
            name: category.name,
            slug: category.slug,
        };
    }

    const { code } = Locale.from(locale);

    const { i18n } = category;
    const populatedLocales = Object.keys(i18n).filter((localeCode) => i18n[localeCode].name);
    const targetLocale =
        populatedLocales.find((localeCode) => localeCode === code) ??
        populatedLocales.find((localeCode) => i18n[localeCode].name === category.display_name) ??
        populatedLocales[0];

    const { name, slug, description } = i18n[targetLocale];

    return { name, slug, description };
}

export function getCategoryUrl(
    category: Pick<Category, 'i18n' | 'display_name'> | AlgoliaCategoryRef,
    locale: Locale | Locale.AnyCode,
): string {
    const { slug } = getLocalizedCategoryData(category, locale);
    return `/category/${slug}`;
}

export function getCategoryHasTranslation(
    category: Pick<Category, 'i18n'>,
    locale: Locale | Locale.AnyCode,
): boolean {
    const { code } = Locale.from(locale);
    const { i18n } = category;
    const populatedLocales = Object.keys(i18n).filter((localeCode) => i18n[localeCode].name);
    return Boolean(populatedLocales.find((localeCode) => localeCode === code));
}
