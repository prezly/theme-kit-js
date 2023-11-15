import type { Category } from '@prezly/sdk';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface Props {
    category: CategoryLink.DisplayedCategory;
    className?: string;
}

export function CategoryLink({ category, className }: Props) {
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
}
