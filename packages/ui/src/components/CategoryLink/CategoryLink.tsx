import type { Category, Culture } from '@prezly/sdk';
import { getCategoryUrl, getLocalizedCategoryData, LocaleObject } from '@prezly/theme-kit-core';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface Props {
    category: Category;
    locale: Culture['code'];
    className?: string;
}

export function CategoryLink({ category, locale, className }: Props) {
    const localeObj = LocaleObject.fromAnyCode(locale);
    const { name } = getLocalizedCategoryData(category, localeObj);

    return (
        <Link href={getCategoryUrl(category, localeObj)} locale={locale} passHref legacyBehavior>
            <a className={twMerge(`label-large text-accent`, className)}>
                <span>{name}</span>
            </a>
        </Link>
    );
}
