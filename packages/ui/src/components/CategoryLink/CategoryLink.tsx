import type { Category } from '@prezly/sdk';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

export function CategoryLink({ category, className }: CategoryLink.Props) {
    return (
        <Link className={twMerge(`label-large text-accent`, className)} href={category.href}>
            <span>{category.name}</span>
        </Link>
    );
}

export namespace CategoryLink {
    export interface DisplayedCategory {
        name: Category.Translation['name'];
        href: `/${string}`;
    }

    export interface Props {
        category: DisplayedCategory;
        className?: string;
    }
}
