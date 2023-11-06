import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import type { Culture, Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import { hasAnySocialMedia } from '@prezly/theme-kit-core';

import { Link } from '../Link';
import { SocialMedia } from '../StoryShareLinks';

import { SubFooter } from './SubFooter';

export interface Props {
    className?: string;
    companyInformation: NewsroomCompanyInformation;
    externalSiteLink?: string;
    hasStandaloneAboutPage?: boolean;
    hasStandaloneContactsPage?: boolean;
    publicGalleriesCount: number;
    locale: Culture['code'];
    newsroom: Pick<
        Newsroom,
        'uuid' | 'custom_data_request_link' | 'display_name' | 'is_white_labeled'
    >;
}

export function Footer({
    className,
    companyInformation,
    externalSiteLink,
    hasStandaloneAboutPage,
    hasStandaloneContactsPage,
    locale,
    newsroom,
    publicGalleriesCount,
}: Props) {
    const hasSocialMedia = hasAnySocialMedia(companyInformation);

    return (
        <footer className={className}>
            <div className="p-12 flex flex-col md:flex-row bg-gray-900 justify-between">
                <div className="flex flex-col gap-6">
                    {hasSocialMedia && (
                        <SocialMedia
                            iconClassName="text-white"
                            companyInformation={companyInformation}
                        />
                    )}
                    <div className="hidden md:flex items-center gap-6 mt-auto">
                        {externalSiteLink && (
                            <Link
                                className="text-white hover:text-white hover:underline mt-auto "
                                href={externalSiteLink}
                                icon={ArrowUpRightIcon}
                                iconPlacement="right"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {new URL(externalSiteLink).hostname}
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex flex-col md:items-end mt-6 md:mt-0 gap-6">
                    <Link className="text-white hover:text-white hover:underline" href="/stories">
                        {/* TODO: add translations */}
                        All stories
                    </Link>
                    {hasStandaloneAboutPage && (
                        <Link className="text-white hover:text-white hover:underline" href="/about">
                            {/* TODO: add translations */}
                            About
                        </Link>
                    )}
                    {publicGalleriesCount > 0 && (
                        <Link className="text-white hover:text-white hover:underline" href="/media">
                            {/* TODO: add translations */}
                            Media
                        </Link>
                    )}
                    {hasStandaloneContactsPage && (
                        <Link
                            className="text-white hover:text-white hover:underline"
                            href="/contacts"
                        >
                            {/* TODO: add translations */}
                            Contacts
                        </Link>
                    )}
                    {externalSiteLink && (
                        <Link
                            className="flex md:hidden text-white hover:text-white hover:underline mt-auto "
                            href={externalSiteLink}
                            icon={ArrowUpRightIcon}
                            iconPlacement="right"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {new URL(externalSiteLink).hostname}
                        </Link>
                    )}
                </div>
            </div>
            <SubFooter newsroom={newsroom} locale={locale} />
        </footer>
    );
}
