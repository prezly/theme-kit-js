import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { Category, Culture } from '@prezly/sdk';
import { getCategoryUrl, getLocalizedCategoryData, LocaleObject } from '@prezly/theme-kit-core';
import { twMerge } from 'tailwind-merge';

import { Link } from '../Link';

export interface Props {
    category: Category;
    className?: string;
    locale: Culture['code'];
}

export function CategoryBlock({ className, category, locale }: Props) {
    const localeObj = LocaleObject.fromAnyCode(locale);
    const { name, description } = getLocalizedCategoryData(category, localeObj);

    return (
        <div
            className={twMerge(
                'flex flex-col p-6 w-full md:w-64 rounded border border-gray-200',
                className,
            )}
        >
            <h3 className="subtitle-small">{name}</h3>
            {description && <p className="mt-1 text-small">{description}</p>}

            <Link
                className="label-large text-accent mt-5"
                href={getCategoryUrl(category, localeObj)}
                localeCode={locale}
                icon={ArrowRightIcon}
                iconPlacement="right"
            >
                {/* TODO:  Add translations */}
                View
            </Link>
        </div>
    );
}
