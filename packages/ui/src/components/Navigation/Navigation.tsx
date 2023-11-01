import {
    ArrowUpRightIcon,
    Bars3BottomRightIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import type { Category, Culture, NewsroomLanguageSettings, UploadedImage } from '@prezly/sdk';
import Image from '@prezly/uploadcare-image';
import Link from 'next/link';
import { type MouseEvent as ReactMouseEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useDevice } from '@/hooks';

import { Button } from '../Button';

import { CategoriesDropdown, LanguagesDropdown } from './components';
import type { NavigationLayout } from './types';
import { extractDomainFromUrl } from './util';

export interface Props {
    className?: string;
    categories: Category[];
    languages: NewsroomLanguageSettings[];
    layout?: NavigationLayout;
    logo?: UploadedImage | null;
    siteName: string;
    publicGalleriesCount: number;
    externalSiteLink?: string;
    isSearchEnabled?: boolean;
    onSearch?: () => void;
    locale: Culture['code'];
    hasStandaloneAboutPage?: boolean;
    hasStandaloneContactsPage?: boolean;
    hasError?: boolean;
}

export function Navigation({
    className,
    categories,
    languages,
    layout = 'default',
    logo,
    siteName,
    publicGalleriesCount,
    externalSiteLink,
    isSearchEnabled,
    onSearch,
    locale,
    hasStandaloneAboutPage,
    hasStandaloneContactsPage,
    hasError,
}: Props) {
    const [openMobileNav, setOpenMobileNav] = useState(false);
    const { isTablet } = useDevice();

    function toggleMobileNav() {
        setOpenMobileNav(!openMobileNav);
    }

    function handleSearch(event?: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) {
        event?.preventDefault();

        onSearch?.();
    }

    return (
        <header className={twMerge('p-6 lg:px-12 border-b border-gray-200 relative', className)}>
            <nav className="flex items-center justify-between">
                <Link className="flex items-center gap-2" href="/" locale={locale}>
                    <h1 className={twMerge(`subtitle-medium`, Boolean(logo) && `hidden`)}>
                        {siteName}
                    </h1>
                    {logo && (
                        <Image
                            className="w-auto min-w-[80px] max-w-[120px] md:max-w-none max-h-12"
                            layout="fill"
                            objectFit="contain"
                            imageDetails={logo}
                            alt={siteName}
                        />
                    )}
                    <p className="label-large pl-2 border-l border-gray-400 text-gray-400">
                        Newsroom
                    </p>
                </Link>
                <div
                    className={twMerge(
                        'md:items-center justify-between gap-12 md:gap-4 hidden md:flex',
                        openMobileNav &&
                            `flex flex-col w-screen absolute top-24 left-0 z-10 bg-white pt-6 border-b border-gray-200`,
                        layout === 'centered' ? `md:w-2/3` : 'w-max',
                    )}
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-4 px-6 md:px-0">
                        {categories.length && (
                            <CategoriesDropdown categories={categories} locale={locale} />
                        )}
                        {publicGalleriesCount > 0 && (
                            <Link
                                className={twMerge(
                                    'label-large hover:font-semibold shrink-0',
                                    isTablet && `text-lg font-bold`,
                                )}
                                href="/media"
                                locale={locale ?? false}
                            >
                                {/* TODO: Use translations */}
                                Media
                            </Link>
                        )}
                        {hasStandaloneAboutPage && (
                            <Link
                                className={twMerge(
                                    'label-large hover:font-semibold shrink-0',
                                    isTablet && `text-lg font-bold`,
                                )}
                                href="/about"
                                locale={locale ?? false}
                            >
                                {/* TODO: Use translations */}
                                About
                            </Link>
                        )}
                        {hasStandaloneContactsPage && (
                            <Link
                                className={twMerge(
                                    'label-large hover:font-semibold shrink-0',
                                    isTablet && `text-lg font-bold`,
                                )}
                                href="/contacts"
                                locale={locale}
                            >
                                {/* TODO: Use translations */}
                                Contacts
                            </Link>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-4">
                        {Boolean(isSearchEnabled && onSearch) && (
                            <a className="hidden md:flex" href="#" onClick={handleSearch}>
                                <MagnifyingGlassIcon className="w-[20px] h-[20px]" />
                            </a>
                        )}
                        <div className="flex items-start md:items-center flex-row-reverse md:flex-row bg-gray-50 md:bg-transparent p-6 md:p-0 gap-4 justify-between md:justify-start">
                            {languages.length > 0 && (
                                <LanguagesDropdown
                                    hasError={hasError}
                                    languages={languages}
                                    locale={locale}
                                />
                            )}
                            {externalSiteLink && (
                                <a
                                    className="label-large hover:font-semibold flex items-center shrink-0"
                                    href={externalSiteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {extractDomainFromUrl(externalSiteLink)}
                                    <ArrowUpRightIcon className="ml-1 w-2 h-2" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 md:hidden">
                    {Boolean(isSearchEnabled && onSearch) && (
                        <Button
                            className="p-0"
                            variation="navigation"
                            icon={MagnifyingGlassIcon}
                            iconClassName="w-6 h-6"
                            onClick={onSearch}
                        />
                    )}
                    <Button
                        className="p-0"
                        variation="navigation"
                        icon={openMobileNav ? XMarkIcon : Bars3BottomRightIcon}
                        iconClassName="w-6 h-6"
                        onClick={toggleMobileNav}
                    />
                </div>
            </nav>
        </header>
    );
}
