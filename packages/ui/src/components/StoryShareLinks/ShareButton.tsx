import type { FunctionComponent, SVGProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { FacebookIcon, LinkedinIcon, PinterestIcon, TwitterIcon } from '@/icons';

import type { ShareableSocialNetwork, StoryShareLinksLayout } from './types';
import { getSocialShareUrl } from './utils';

export interface Props {
    network: ShareableSocialNetwork;
    shareUrl: string;
    layout?: StoryShareLinksLayout;
    iconClassName?: string;
}

const IconsMap: Record<ShareableSocialNetwork, FunctionComponent<SVGProps<SVGSVGElement>>> = {
    facebook: FacebookIcon,
    linkedin: LinkedinIcon,
    pinterest: PinterestIcon,
    twitter: TwitterIcon,
};

export function ShareButton({ network, shareUrl, layout, iconClassName }: Props) {
    const Icon = IconsMap[network];

    return (
        <a
            href={getSocialShareUrl('facebook', shareUrl)}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            aria-label="Facebook"
            className={twMerge(
                'p-3 border-gray-200',
                layout === 'vertical' ? `border-b  last:border-b-0` : `border-r last:border-r-0`,
            )}
        >
            <Icon className={twMerge('text-gray-800 w-5', iconClassName)} />
        </a>
    );
}
