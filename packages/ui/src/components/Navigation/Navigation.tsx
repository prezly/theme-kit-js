import { ArrowUpRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Category, Culture, NewsroomLanguageSettings, UploadedImage } from '@prezly/sdk';
import Image from '@prezly/uploadcare-image';
import Link from 'next/link';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';

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
}: Props) {
    function handleSearch(event?: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) {
        event?.preventDefault();

        onSearch?.();
    }

    return (
        <header className={twMerge('p-6 lg:px-12 border-b border-gray-200', className)}>
            <nav className="flex items-center justify-between">
                <Link className="flex items-center gap-2" href="/" locale={locale}>
                    <h1 className={twMerge(`subtitle-medium`, Boolean(logo) && `hidden`)}>
                        {siteName}
                    </h1>
                    {logo && (
                        <Image
                            className="w-auto max-h-12"
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
                        'flex items-center justify-between gap-4',
                        layout === 'centered' ? `md:w-2/3` : 'w-max',
                    )}
                >
                    <div className="flex items-center gap-4">
                        {categories.length && (
                            <CategoriesDropdown categories={categories} locale={locale} />
                        )}
                        {publicGalleriesCount > 0 && (
                            <Link
                                className="label-large hover:font-semibold shrink-0"
                                href="/media"
                                locale={locale ?? false}
                            >
                                {/* TODO: Use translations */}
                                Media
                            </Link>
                        )}
                        {hasStandaloneAboutPage && (
                            <Link
                                className="label-large hover:font-semibold shrink-0"
                                href="/about"
                                locale={locale ?? false}
                            >
                                {/* TODO: Use translations */}
                                About
                            </Link>
                        )}
                        {hasStandaloneContactsPage && (
                            <Link
                                className="label-large hover:font-semibold shrink-0"
                                href="/contacts"
                                locale={locale}
                            >
                                {/* TODO: Use translations */}
                                Contacts
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {Boolean(isSearchEnabled && onSearch) && (
                            <a href="#" onClick={handleSearch}>
                                <MagnifyingGlassIcon className="w-[20px] h-[20px]" />
                            </a>
                        )}
                        {languages.length > 0 && (
                            <LanguagesDropdown languages={languages} locale={locale} />
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
            </nav>
        </header>
    );
}
