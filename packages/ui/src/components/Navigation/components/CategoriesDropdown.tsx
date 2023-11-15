'use client';

import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import type { Category } from '@prezly/sdk';
import Link from 'next/link';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { useDevice } from '@/hooks';

export function CategoriesDropdown({ options, indexHref, intl = {} }: CategoriesDropdown.Props) {
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
                    {intl['categories.title'] ?? 'Categories'}
                </Button>
                <div
                    className={twMerge(`hidden`, mobileDropdownOpen && `flex flex-col gap-6 mt-6`)}
                >
                    {options.map(({ id, href, name }) => (
                        <Link className="gap-2 label-large text-gray-600" href={href} key={id}>
                            {name}
                        </Link>
                    ))}
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
            label={intl['categories.title'] ?? 'Categories'}
        >
            <div>
                <div className="grid grid-cols-4 gap-y-8 gap-x-12">
                    {options.map(({ id, href, name, description }) => (
                        <div key={id}>
                            <Link className="gap-2 group" href={href}>
                                <h3 className="title-xx-small group-hover:underline">{name}</h3>
                                <p className="text-description">{description}</p>
                            </Link>
                            <Link
                                className="w-max mt-3 label-medium flex items-center gap-2 text-accent hover:underline"
                                href={href}
                            >
                                {intl['categories.view'] ?? 'View'}
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
                {indexHref && (
                    <Link
                        className="w-max ml-auto mt-8 label-large flex items-center gap-2 hover:underline"
                        href={indexHref}
                    >
                        {intl['categories.viewAll'] ?? 'View all'}{' '}
                        <ArrowRightIcon className="w-[20px] h-[20px]" />
                    </Link>
                )}
            </div>
        </Dropdown>
    );
}

export namespace CategoriesDropdown {
    export interface Intl {
        ['categories.title']: string;
        ['categories.view']: string;
        ['categories.viewAll']: string;
    }
    export interface Option {
        id: Category['id'];
        name: Category.Translation['name'];
        description: Category.Translation['description'];
        href: `/${string}`;
    }

    export interface Props {
        options: Option[];
        intl?: Partial<Intl>;
        indexHref?: `/${string}`;
    }
}
