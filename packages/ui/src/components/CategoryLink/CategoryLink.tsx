import type { Category, Culture } from '@prezly/sdk';
import {
    type AlgoliaCategoryRef,
    getCategoryUrl,
    getLocalizedCategoryData,
} from '@prezly/theme-kit-core';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface Props {
    category: Pick<Category, 'i18n' | 'display_name'> | AlgoliaCategoryRef;
    locale: Culture['code'];
    className?: string;
}

export function CategoryLink({ category, locale, className }: Props) {
    const { name } = getLocalizedCategoryData(category, locale);

    return (
        <Link
            className={twMerge(`label-large text-accent`, className)}
            href={getCategoryUrl(category, locale)}
            locale={locale}
        >
            <span>{name}</span>
        </Link>
    );
}
