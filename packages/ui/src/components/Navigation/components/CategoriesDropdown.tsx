'use client';

import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import type { Category, Culture } from '@prezly/sdk';
import { getCategoryUrl, getLocalizedCategoryData } from '@prezly/theme-kit-core';
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
                        const categoryData = getLocalizedCategoryData(category, locale);
                        return (
                            <Link
                                className="gap-2 label-large text-gray-600"
                                href={getCategoryUrl(category, locale)}
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
            contentProps={{
                className: 'bg-gray-50 w-screen mt-10 p-12',
            }}
            // TODO: Add translations
            label="Categories"
        >
            <div>
                <div className="grid grid-cols-4 gap-y-8 gap-x-12">
                    {categories.map((category) => {
                        const categoryData = getLocalizedCategoryData(category, locale);
                        return (
                            <div key={category.id}>
                                <Link
                                    className="gap-2 group"
                                    href={getCategoryUrl(category, locale)}
                                    locale={locale}
                                >
                                    <h3 className="title-xx-small group-hover:underline">
                                        {categoryData.name}
                                    </h3>
                                    <p className="text-description">{categoryData.description}</p>
                                </Link>
                                <Link
                                    className="w-max mt-3 label-medium flex items-center gap-2 text-accent hover:underline"
                                    href={getCategoryUrl(category, locale)}
                                    locale={locale}
                                >
                                    View all
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Link>
                            </div>
                        );
                    })}
                </div>
                <Link
                    className="w-max ml-auto mt-8 label-large flex items-center gap-2 hover:underline"
                    href="/categories"
                    locale={locale}
                >
                    View all categories <ArrowRightIcon className="w-[20px] h-[20px]" />
                </Link>
            </div>
        </Dropdown>
    );
}
