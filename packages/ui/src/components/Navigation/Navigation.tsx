'use client';

import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import { Bars3BottomRightIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Culture, Newsroom } from '@prezly/sdk';
import Image from '@prezly/uploadcare-image';
import Link from 'next/link';
import { type MouseEvent as ReactMouseEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useDevice } from '@/hooks';

import { Button } from '../Button';

import { CategoriesDropdown, LanguagesDropdown } from './components';

export function Navigation({
    className,
    intl = {},
    categories = { options: [] },
    languages = [],
    newsroom,
    showNewsroomLabelAsideLogo,
    externalSiteLink,
    onSearch,
    locale,
    hasStandaloneAboutPage,
    hasStandaloneContactsPage,
    indexHref,
    aboutHref,
    contactsHref,
    mediaHref,
}: Navigation.Props) {
    const [openMobileNav, setOpenMobileNav] = useState(false);
    const { isSm } = useDevice();
    const { name, logo } = newsroom;
    const hasExtraLinks = Boolean(
        categories.options.length > 0 ||
            languages.length > 0 ||
            mediaHref ||
            hasStandaloneAboutPage ||
            hasStandaloneContactsPage ||
            externalSiteLink,
    );

    const selectedLanguage = languages.find((lang) => lang.code === locale);
    const shouldUseCenteredLayout =
        [
            categories.options.length,
            languages.length,
            mediaHref,
            hasStandaloneAboutPage,
            hasStandaloneContactsPage,
            externalSiteLink,
        ].filter(Boolean).length >= 5;

    let externalLinkLabel = '';
    if (externalSiteLink) {
        externalLinkLabel =
            new URL(externalSiteLink).hostname.length > 15
                ? 'Website'
                : new URL(externalSiteLink).hostname;
    }

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
                <Link className="flex items-center gap-2" href={indexHref}>
                    <h1 className={twMerge(`subtitle-medium`, Boolean(logo) && `hidden`)}>
                        {name}
                    </h1>
                    {logo && (
                        <Image
                            className="w-auto min-w-[80px] max-w-[120px] md:max-w-none max-h-12"
                            layout="fill"
                            objectFit="contain"
                            imageDetails={logo}
                            alt={name}
                        />
                    )}
                    {showNewsroomLabelAsideLogo && (
                        <p className="label-large pl-2 border-l border-gray-400 text-gray-400">
                            {intl['newsroom.title'] ?? 'Newsroom'}
                        </p>
                    )}
                </Link>
                <div
                    className={twMerge(
                        'md:items-center justify-between gap-12 md:gap-4 hidden md:flex',
                        Boolean(openMobileNav && !isSm) &&
                            `flex flex-col w-screen absolute top-24 left-0 z-10 bg-white border-b border-gray-200`,
                        shouldUseCenteredLayout ? `lg:w-2/3` : 'md:w-max',
                    )}
                >
                    {Boolean(
                        categories.options.length > 0 ||
                            hasStandaloneAboutPage ||
                            hasStandaloneContactsPage ||
                            mediaHref,
                    ) && (
                        <div className="pt-6 md:pt-0 flex flex-col md:flex-row md:items-center gap-12 md:gap-4 px-6 md:px-0">
                            {categories.options.length > 0 && (
                                <CategoriesDropdown
                                    options={categories.options}
                                    intl={intl}
                                    indexHref={categories.indexHref}
                                />
                            )}
                            {mediaHref && (
                                <Link className={linkClassName} href={mediaHref}>
                                    {intl['media.title'] ?? 'Media'}
                                </Link>
                            )}
                            {hasStandaloneAboutPage && aboutHref && (
                                <Link className={linkClassName} href={aboutHref}>
                                    {intl['about.title'] ?? 'About'}
                                </Link>
                            )}
                            {hasStandaloneContactsPage && contactsHref && (
                                <Link className={linkClassName} href={contactsHref}>
                                    {intl['contacts.title'] ?? 'Contacts'}
                                </Link>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-4">
                        {Boolean(onSearch) && (
                            <Button
                                className="hidden md:flex p-0"
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
                                        {externalLinkLabel}
                                        <ArrowUpRightIcon className="ml-1 w-5 h-5" />
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
    export interface Intl extends CategoriesDropdown.Intl {
        ['newsroom.title']: string;
        ['media.title']: string;
        ['about.title']: string;
        ['contacts.title']: string;
    }

    export type DisplayedLanguage = LanguagesDropdown.Option;
    export type DisplayedCategory = CategoriesDropdown.Option;

    export interface DisplayedNewsroom {
        name: Newsroom['display_name'];
        logo: Newsroom['newsroom_logo'];
    }

    export interface Props {
        className?: string;
        intl?: Partial<Navigation.Intl>;
        categories?: {
            options: Navigation.DisplayedCategory[];
            indexHref?: CategoriesDropdown.Props['indexHref'];
        };
        languages?: Navigation.DisplayedLanguage[];
        showNewsroomLabelAsideLogo?: boolean;
        externalSiteLink?: string;
        onSearch?: () => void;
        locale: Culture['code'];
        hasStandaloneAboutPage?: boolean;
        hasStandaloneContactsPage?: boolean;
        newsroom: DisplayedNewsroom;
        indexHref: `/${string}`;
        mediaHref: `/${string}`;
        aboutHref?: `/${string}`;
        contactsHref?: `/${string}`;
    }
}
