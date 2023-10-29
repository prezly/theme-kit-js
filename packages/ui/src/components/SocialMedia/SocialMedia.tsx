import { ArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import type { NewsroomCompanyInformation } from '@prezly/sdk';
import { type MouseEvent as ReactMouseEvent, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import {
    FacebookIcon,
    InstagramIcon,
    LinkedinIcon,
    PinterestIcon,
    TikTokIcon,
    TwitterIcon,
    YoutubeIcon,
} from '@/icons';

import { getSocialLinks } from './utils';

export interface Props {
    companyInformation: NewsroomCompanyInformation;
    shareUrl?: string;
    onUrlCopied?: () => void;
    showScrollToTopButton?: boolean;
    className?: string;
    iconClassName?: string;
    layout?: 'vertical' | 'horizontal';
}

const SCROLL_TOP_MIN_HEIGHT = 300;

export function SocialMedia({
    companyInformation,
    className,
    iconClassName,
    shareUrl,
    onUrlCopied,
    showScrollToTopButton,
    layout = 'horizontal',
}: Props) {
    const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);

    const { facebook, instagram, linkedin, pinterest, tiktok, twitter, youtube } =
        getSocialLinks(companyInformation);

    function copyShareUrl(event?: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) {
        event?.preventDefault();

        if (!shareUrl) return;

        window.navigator.clipboard.writeText(shareUrl);
        onUrlCopied?.();
    }

    useEffect(() => {
        function scrollListener() {
            setIsScrollToTopVisible(
                document.body.scrollTop > SCROLL_TOP_MIN_HEIGHT ||
                    document.documentElement.scrollTop > SCROLL_TOP_MIN_HEIGHT,
            );
        }
        if (typeof window !== 'undefined') {
            window.onscroll = scrollListener;
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.onscroll = null;
            }
        };
    }, []);

    function scrollToTop(event?: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) {
        event?.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    return (
        <div
            className={twMerge(
                `flex items-center rounded border border-gray-200 w-max`,
                layout === 'vertical' && `flex-col h-max`,
                className,
            )}
        >
            {facebook && (
                <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    aria-label="Facebook"
                    className={twMerge(
                        'p-3 border-gray-200',
                        layout === 'vertical'
                            ? `border-b  last:border-b-0`
                            : `border-r last:border-r-0`,
                    )}
                >
                    <FacebookIcon className={twMerge('text-gray-800 w-5', iconClassName)} />
                </a>
            )}
            {instagram && (
                <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    aria-label="Instagram"
                    className={twMerge(
                        'p-3 border-gray-200',
                        layout === 'vertical'
                            ? `border-b  last:border-b-0`
                            : `border-r last:border-r-0`,
                    )}
                >
                    <InstagramIcon className={twMerge('text-gray-800 w-5', iconClassName)} />
                </a>
            )}
            {linkedin && (
                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                    className={twMerge(
                        'p-3 border-gray-200',
                        layout === 'vertical'
                            ? `border-b  last:border-b-0`
                            : `border-r last:border-r-0`,
                    )}
                >
                    <LinkedinIcon className={twMerge('text-gray-800 w-5', iconClassName)} />
                </a>
            )}
            {pinterest && (
                <a
                    href={pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Pinterest"
                    aria-label="Pinterest"
                    className={twMerge(
                        'p-3 border-gray-200',
                        layout === 'vertical'
                            ? `border-b  last:border-b-0`
                            : `border-r last:border-r-0`,
                    )}
                >
                    <PinterestIcon className={twMerge('text-gray-800 w-5', iconClassName)} />
                </a>
            )}
            {tiktok && (
                <a
                    href={tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok"
                    aria-label="TikTok"
                    className={twMerge(
                        'p-3 border-gray-200',
                        layout === 'vertical'
                            ? `border-b  last:border-b-0`
                            : `border-r last:border-r-0`,
                    )}
                >
                    <TikTokIcon className={twMerge('text-gray-800 w-5', iconClassName)} />
                </a>
            )}
            {twitter && (
                <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Twitter"
                    aria-label="Twitter"
                    className={twMerge(
                        'p-3 border-gray-200',
                        layout === 'vertical'
                            ? `border-b  last:border-b-0`
                            : `border-r last:border-r-0`,
                    )}
                >
                    <TwitterIcon className={twMerge('text-gray-800 w-5', iconClassName)} />
                </a>
            )}
            {youtube && (
                <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Youtube"
                    aria-label="Youtube"
                    className={twMerge(
                        'p-3 border-gray-200',
                        layout === 'vertical'
                            ? `border-b  last:border-b-0`
                            : `border-r last:border-r-0`,
                    )}
                >
                    <YoutubeIcon className={twMerge('text-gray-800 w-5', iconClassName)} />
                </a>
            )}
            {shareUrl && (
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Copy URL"
                    aria-label="Copy URL"
                    className={twMerge(
                        'p-3 border-gray-200',
                        layout === 'vertical'
                            ? `border-b  last:border-b-0`
                            : `border-r last:border-r-0`,
                    )}
                    onClick={copyShareUrl}
                >
                    <LinkIcon className={twMerge('text-gray-800 w-5', iconClassName)} />
                </a>
            )}
            {showScrollToTopButton && isScrollToTopVisible && (
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Go to top"
                    aria-label="Go to top"
                    className={twMerge(
                        'p-3 border-gray-200',
                        layout === 'vertical'
                            ? `border-b  last:border-b-0`
                            : `border-r last:border-r-0`,
                    )}
                    onClick={scrollToTop}
                >
                    <ArrowUpIcon className={twMerge('text-gray-800 w-5', iconClassName)} />
                </a>
            )}
        </div>
    );
}
