import type { Category } from '@prezly/sdk';
import { Fragment } from 'react';
import { twMerge } from 'tailwind-merge';

import { CategoryLink } from '../CategoryLink';

export function CategoriesList({ categories, className }: CategoriesList.Props) {
    return (
        <div className={twMerge('flex items-center', className)}>
            {categories.map((category, index) => (
                <Fragment key={category.id}>
                    {index !== 0 && <span className="label-large text-gray-500 mx-1">·</span>}
                    <CategoryLink category={category} />
                </Fragment>
            ))}
        </div>
    );
}

export namespace CategoriesList {
    export interface DisplayedCategory extends CategoryLink.DisplayedCategory {
        id: Category['id'];
    }

    export interface Props {
        categories: DisplayedCategory[];
        className?: string;
    }
}
