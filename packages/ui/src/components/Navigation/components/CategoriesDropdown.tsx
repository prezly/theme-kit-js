import type { Category, Culture } from '@prezly/sdk';
import { getCategoryUrl, getLocalizedCategoryData, LocaleObject } from '@prezly/theme-kit-core';
import Link from 'next/link';

import { Dropdown } from '@/components/Dropdown';

export interface Props {
    categories: Category[];
    locale: Culture['code'];
}

export function CategoriesDropdown({ categories, locale }: Props) {
    return (
        <Dropdown
            className="border-0 w-max p-0"
            contentClassName="w-screen mt-10 grid grid-cols-4 p-12 gap-y-8"
            // TODO: Add translations
            label="Categories"
        >
            {categories.map((category) => {
                const categoryData = getLocalizedCategoryData(
                    category,
                    LocaleObject.fromAnyCode(locale),
                );
                return (
                    <Link
                        className="gap-2 group"
                        href={getCategoryUrl(category, LocaleObject.fromAnyCode(locale))}
                        key={category.id}
                    >
                        <h3 className="title-xx-small group-hover:underline">
                            {categoryData.name}
                        </h3>
                        <p className="text-description">{categoryData.description}</p>
                    </Link>
                );
            })}
        </Dropdown>
    );
}
