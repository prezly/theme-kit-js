import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Category } from '@prezly/sdk';
import { twMerge } from 'tailwind-merge';

import { Link } from '../Link';

type Props = CategoryBlock.Props;

export function CategoryBlock({ className, category, intl = {} }: Props) {
    return (
        <div
            className={twMerge(
                'flex flex-col p-6 w-full md:w-64 rounded border border-gray-200',
                className,
            )}
        >
            <h3 className="subtitle-small">{category.name}</h3>
            {category.description && <p className="mt-1 text-small">{category.description}</p>}

            <Link
                className="label-large text-accent mt-5"
                href={category.href}
                icon={ArrowRightIcon}
                iconPlacement="right"
            >
                {intl['category.view'] ?? 'View'}
            </Link>
        </div>
    );
}

export namespace CategoryBlock {
    export interface Intl {
        ['category.view']: string;
    }

    export interface DisplayedCategory {
        name: Category.Translation['name'];
        description: Category.Translation['description'];
        href: `/${string}`;
    }
    export interface Props {
        className?: string;
        intl?: Partial<CategoryBlock.Intl>;
        category: CategoryBlock.DisplayedCategory;
    }
}
