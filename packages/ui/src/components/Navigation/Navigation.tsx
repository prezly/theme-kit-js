'use client';

import {
    ArrowUpRightIcon,
    Bars3BottomRightIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import type { Culture, Newsroom } from '@prezly/sdk';
import Image from '@prezly/uploadcare-image';
import Link from 'next/link';
import { type MouseEvent as ReactMouseEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useDevice } from '@/hooks';

import { Button } from '../Button';

import { CategoriesDropdown, LanguagesDropdown } from './components';
import type { NavigationLayout } from './types';

export interface Props {
    className?: string;
    intl?: Partial<Navigation.Intl>;
    categories?: {
        options: Navigation.DisplayedCategory[];
        indexHref?: CategoriesDropdown.Props['indexHref'];
    };
    languages?: Navigation.DisplayedLanguage[];
    layout?: NavigationLayout;
    showNewsroomLabelAsideLogo?: boolean;
    externalSiteLink?: string;
    onSearch?: () => void;
    locale: Culture['code'];
    hasStandaloneAboutPage?: boolean;
    hasStandaloneContactsPage?: boolean;
    newsroom: Pick<Newsroom, 'display_name' | 'public_galleries_number' | 'newsroom_logo'>;
}

export function Navigation({
    className,
    intl,
    categories = { options: [] },
    languages = [],
    layout = 'default',
    newsroom,
    showNewsroomLabelAsideLogo,
    externalSiteLink,
    onSearch,
    locale,
    hasStandaloneAboutPage,
    hasStandaloneContactsPage,
}: Props) {
    const [openMobileNav, setOpenMobileNav] = useState(false);
    const { isSm } = useDevice();
    const {
        display_name: siteName,
        public_galleries_number: publicGalleriesCount,
        newsroom_logo: logo,
    } = newsroom;
    const hasExtraLinks = Boolean(
        categories.options.length > 0 ||
            languages.length > 0 ||
            publicGalleriesCount ||
            hasStandaloneAboutPage ||
            hasStandaloneContactsPage ||
            externalSiteLink,
    );

    const selectedLanguage = languages.find((lang) => lang.code === locale);

    const linkClassName = twMerge(
        'label-large text-gray-600 hover:text-gray-800 shrink-0',
        !isSm && `text-lg font-bold`,
    );

    function toggleMobileNav() {
        setOpenMobileNav(!openMobileNav);
    }

    function handleSearch(event?: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
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
                    {showNewsroomLabelAsideLogo && (
                        <p className="label-large pl-2 border-l border-gray-400 text-gray-400">
                            Newsroom
                        </p>
                    )}
                </Link>
                <div
                    className={twMerge(
                        'md:items-center justify-between gap-12 md:gap-4 hidden md:flex',
                        Boolean(openMobileNav && !isSm) &&
                            `flex flex-col w-screen absolute top-24 left-0 z-10 bg-white border-b border-gray-200`,
                        layout === 'centered' ? `lg:w-2/3` : 'md:w-max',
                    )}
                >
                    {Boolean(
                        categories.options.length > 0 ||
                            hasStandaloneAboutPage ||
                            hasStandaloneContactsPage ||
                            publicGalleriesCount,
                    ) && (
                        <div className="pt-6 md:pt-0 flex flex-col md:flex-row md:items-center gap-12 md:gap-4 px-6 md:px-0">
                            {categories.options.length > 0 && (
                                <CategoriesDropdown
                                    options={categories.options}
                                    intl={intl}
                                    indexHref={categories.indexHref}
                                />
                            )}
                            {publicGalleriesCount > 0 && (
                                <Link
                                    className={linkClassName}
                                    href="/media"
                                    locale={locale ?? false}
                                >
                                    {/* TODO: Use translations */}
                                    Media
                                </Link>
                            )}
                            {hasStandaloneAboutPage && (
                                <Link
                                    className={linkClassName}
                                    href="/about"
                                    locale={locale ?? false}
                                >
                                    {/* TODO: Use translations */}
                                    About
                                </Link>
                            )}
                            {hasStandaloneContactsPage && (
                                <Link
                                    className={linkClassName}
                                    href="/contacts"
                                    locale={locale ?? false}
                                >
                                    {/* TODO: Use translations */}
                                    Contacts
                                </Link>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-4">
                        {Boolean(onSearch) && (
                            <Button
                                className="hidden md:flex"
                                variation="navigation"
                                icon={MagnifyingGlassIcon}
                                onClick={handleSearch}
                            />
                        )}
                        {Boolean(languages.length || externalSiteLink) && (
                            <div className="flex items-start md:items-center flex-row-reverse md:flex-row bg-gray-50 md:bg-transparent p-6 md:p-0 gap-4 justify-between md:justify-start">
                                {languages.length > 0 && (
                                    <LanguagesDropdown
                                        options={languages}
                                        selected={selectedLanguage}
                                    />
                                )}
                                {externalSiteLink && (
                                    <a
                                        className="label-large text-gray-600 hover:text-gray-800 flex items-center shrink-0"
                                        href={externalSiteLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {new URL(externalSiteLink).hostname}
                                        <ArrowUpRightIcon className="ml-1 w-2 h-2" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 md:hidden">
                    {Boolean(onSearch) && (
                        <Button
                            variation="navigation"
                            icon={MagnifyingGlassIcon}
                            onClick={handleSearch}
                        />
                    )}
                    {hasExtraLinks && (
                        <Button
                            variation="navigation"
                            icon={openMobileNav ? XMarkIcon : Bars3BottomRightIcon}
                            onClick={toggleMobileNav}
                        />
                    )}
                </div>
            </nav>
        </header>
    );
}

export namespace Navigation {
    export type Intl = CategoriesDropdown.Intl;
    export type DisplayedLanguage = LanguagesDropdown.Option;
    export type DisplayedCategory = CategoriesDropdown.Option;
}
