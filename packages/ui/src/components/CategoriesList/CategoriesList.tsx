import type { Category, Culture } from '@prezly/sdk';
import { Fragment } from 'react';

import { CategoryLink } from '../CategoryLink';

interface Props {
    categories: Category[];
    locale: Culture['code'];
}

export function CategoriesList({ categories, locale }: Props) {
    return (
        <div className="flex items-center">
            {categories.map((category, index) => (
                <Fragment key={category.id}>
                    {index !== 0 && <span className="label-large text-gray-500 mr-1">·</span>}
                    <CategoryLink category={category} locale={locale} />
                </Fragment>
            ))}
        </div>
    );
}
