'use client';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { Category, Culture } from '@prezly/sdk';
import { getCategoryUrl, getLocalizedCategoryData, LocaleObject } from '@prezly/theme-kit-core';
import Link from 'next/link';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { useDevice } from '@/hooks';

export interface Props {
    categories: Category[];
    locale: Culture['code'];
}

export function CategoriesDropdown({ categories, locale }: Props) {
    const { isSm } = useDevice();
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

    function toggleDropdown() {
        setMobileDropdownOpen(!mobileDropdownOpen);
    }

    if (!isSm) {
        return (
            <div>
                <Button
                    className="p-0 text-lg font-bold"
                    icon={ChevronDownIcon}
                    iconPlacement="right"
                    onClick={toggleDropdown}
                    variation="navigation"
                >
                    Categories
                </Button>
                <div
                    className={twMerge(`hidden`, mobileDropdownOpen && `flex flex-col gap-6 mt-6`)}
                >
                    {categories.map((category) => {
                        const categoryData = getLocalizedCategoryData(
                            category,
                            LocaleObject.fromAnyCode(locale),
                        );
                        return (
                            <Link
                                className="gap-2 label-large text-gray-600"
                                href={getCategoryUrl(category, LocaleObject.fromAnyCode(locale))}
                                key={category.id}
                            >
                                {categoryData.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <Dropdown
            className="border-0 w-max p-0 text-gray-600 hover:text-gray-800"
            contentClassName="w-screen mt-10 grid grid-cols-4 p-12 gap-y-8"
            // TODO: Add translations
            label="Categories"
        >
            {categories.map((category) => {
                const categoryData = getLocalizedCategoryData(
                    category,
                    LocaleObject.fromAnyCode(locale),
                );
                return (
                    <Link
                        className="gap-2 group"
                        href={getCategoryUrl(category, LocaleObject.fromAnyCode(locale))}
                        key={category.id}
                    >
                        <h3 className="title-xx-small group-hover:underline">
                            {categoryData.name}
                        </h3>
                        <p className="text-description">{categoryData.description}</p>
                    </Link>
                );
            })}
        </Dropdown>
    );
}
