import type { Category, Culture } from '@prezly/sdk';
import type { AlgoliaCategoryRef } from '@prezly/theme-kit-core';
import { Fragment } from 'react';
import { twMerge } from 'tailwind-merge';

import { CategoryLink } from '../CategoryLink';

interface Props {
    categories: (Pick<Category, 'id' | 'i18n' | 'display_name'> | AlgoliaCategoryRef)[];
    locale: Culture['code'];
    className?: string;
}

export function CategoriesList({ categories, locale, className }: Props) {
    return (
        <div className={twMerge('flex items-center', className)}>
            {categories.map((category, index) => (
                <Fragment key={category.id}>
                    {index !== 0 && <span className="label-large text-gray-500 mx-1">·</span>}
                    <CategoryLink category={category} locale={locale} />
                </Fragment>
            ))}
        </div>
    );
}
