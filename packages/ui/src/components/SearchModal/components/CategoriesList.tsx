import type { Category, Culture } from '@prezly/sdk';
import { getCategoryUrl, getLocalizedCategoryData } from '@prezly/theme-kit-core';

import { ButtonLink } from '@/components/Button';

export interface Props {
    categories: Category[];
    locale: Culture['code'];
}

export function CategoriesList({ categories, locale }: Props) {
    return (
        <>
            {/* TODO: Add translations */}
            <p className="subtitle-small text-gray-600">Categories</p>
            <div className="mt-6 flex items-center gap-3 flex-wrap">
                {categories.map((category) => {
                    const { name } = getLocalizedCategoryData(category, locale);

                    return (
                        <ButtonLink
                            key={category.id}
                            href={getCategoryUrl(category, locale)}
                            localeCode={locale}
                            variation="secondary"
                            rounded
                        >
                            {name}
                        </ButtonLink>
                    );
                })}
            </div>
        </>
    );
}
