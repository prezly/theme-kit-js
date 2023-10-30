import type { Category, Culture } from '@prezly/sdk';
import {
    type AlgoliaCategoryRef,
    getCategoryUrl,
    getLocalizedCategoryData,
    LocaleObject,
} from '@prezly/theme-kit-core';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface Props {
    category: Pick<Category, 'i18n' | 'display_name'> | AlgoliaCategoryRef;
    locale: Culture['code'];
    className?: string;
}

export function CategoryLink({ category, locale, className }: Props) {
    const localeObj = LocaleObject.fromAnyCode(locale);
    const { name } = getLocalizedCategoryData(category, localeObj);

    return (
        <Link
            className={twMerge(`label-large text-accent`, className)}
            href={getCategoryUrl(category, localeObj)}
            locale={locale}
        >
            <span>{name}</span>
        </Link>
    );
}
