import { ArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import { type MouseEvent as ReactMouseEvent, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { ShareButton } from './ShareButton';
import type { StoryShareLinksLayout } from './types';

const SCROLL_TOP_MIN_HEIGHT = 300;

export function StoryShareLinks({
    className,
    iconClassName,
    shareUrl,
    onUrlCopied,
    showScrollToTopButton,
    layout = 'horizontal',
}: StoryShareLinks.Props) {
    const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);

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

    if (!shareUrl) {
        return null;
    }

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
            <ShareButton
                network="facebook"
                shareUrl={shareUrl}
                iconClassName={iconClassName}
                layout={layout}
            />
            <ShareButton
                network="twitter"
                shareUrl={shareUrl}
                iconClassName={iconClassName}
                layout={layout}
            />
            <ShareButton
                network="linkedin"
                shareUrl={shareUrl}
                iconClassName={iconClassName}
                layout={layout}
            />
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

export namespace StoryShareLinks {
    export interface Props {
        shareUrl: string | null;
        onUrlCopied?: () => void;
        showScrollToTopButton?: boolean;
        className?: string;
        iconClassName?: string;
        layout?: StoryShareLinksLayout;
    }
}
