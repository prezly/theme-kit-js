import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

import { Link } from '../Link';
import { SocialMedia } from '../StoryShareLinks';

import { SubFooter } from './SubFooter';
import { hasAnySocialMedia } from './util';

export function Footer({
    className,
    companySocials,
    externalSiteLink,
    hasStandaloneAboutPage,
    hasStandaloneContactsPage,
    newsroomName,
    publicGalleriesCount,
    isWhiteLabeled,
    intl = {},
    privacyRequestLink,
}: Footer.Props) {
    const hasSocialMedia = hasAnySocialMedia(companySocials);

    return (
        <footer className={className}>
            <div className="p-12 flex flex-col md:flex-row bg-gray-900 justify-between">
                <div className="flex flex-col gap-6">
                    {hasSocialMedia && (
                        <SocialMedia
                            iconClassName="text-white hover:text-gray-400"
                            companySocials={companySocials}
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
                        {intl['allStories.title'] ?? 'All stories'}
                    </Link>
                    {hasStandaloneAboutPage && (
                        <Link className="text-white hover:text-white hover:underline" href="/about">
                            {intl['boilerplate.about'] ?? 'About'}
                        </Link>
                    )}
                    {publicGalleriesCount > 0 && (
                        <Link className="text-white hover:text-white hover:underline" href="/media">
                            {intl['mediaGallery.title'] ?? 'Media'}
                        </Link>
                    )}
                    {hasStandaloneContactsPage && (
                        <Link
                            className="text-white hover:text-white hover:underline"
                            href="/contacts"
                        >
                            {intl['contacts.title'] ?? 'Contacts'}
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
            <SubFooter
                intl={intl}
                isWhiteLabeled={isWhiteLabeled}
                newsroomDisplayName={newsroomName}
                privacyRequestLink={privacyRequestLink}
            />
        </footer>
    );
}

export namespace Footer {
    export interface Intl extends SubFooter.Intl {
        ['contacts.title']: string;
        ['boilerplate.about']: string;
        ['mediaGallery.title']: string;
        ['allStories.title']: string;
    }

    export interface Props {
        className?: string;
        isWhiteLabeled?: boolean;
        companySocials: SocialMedia.CompanySocials;
        externalSiteLink?: string;
        hasStandaloneAboutPage?: boolean;
        hasStandaloneContactsPage?: boolean;
        publicGalleriesCount: number;
        newsroomName: string;
        intl?: Partial<Intl>;
        privacyRequestLink: string;
    }
}
