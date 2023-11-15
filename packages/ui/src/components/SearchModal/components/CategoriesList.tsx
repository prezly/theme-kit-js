import type { Category } from '@prezly/sdk';

import { ButtonLink } from '@/components/Button';
import type { CategoryLink } from '@/components/CategoryLink';

export function CategoriesList({ categories, intl = {} }: CategoriesList.Props) {
    return (
        <>
            <p className="subtitle-small text-gray-600">
                {intl['categories.title'] ?? 'Categories'}
            </p>
            <div className="mt-6 flex items-center gap-3 flex-wrap">
                {categories.map((category) => (
                    <ButtonLink
                        key={category.id}
                        href={category.href}
                        variation="secondary"
                        rounded
                    >
                        {category.name}
                    </ButtonLink>
                ))}
            </div>
        </>
    );
}

export namespace CategoriesList {
    export interface Intl {
        ['categories.title']: string;
    }

    export interface DisplayedCategory extends CategoryLink.DisplayedCategory {
        id: Category['id'];
    }

    export interface Props {
        categories: DisplayedCategory[];
        intl?: Partial<Intl>;
    }
}
