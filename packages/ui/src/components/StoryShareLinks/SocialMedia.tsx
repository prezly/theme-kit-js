import type { NewsroomCompanyInformation } from '@prezly/sdk';
import { twMerge } from 'tailwind-merge';

import { Icons } from '@/icons';

import { getSocialLinks } from './utils';

export interface Props {
    className?: string;
    iconClassName?: string;
    companyInformation: NewsroomCompanyInformation;
}

export function SocialMedia({ className, companyInformation, iconClassName }: Props) {
    const { facebook, instagram, linkedin, pinterest, tiktok, twitter, youtube } =
        getSocialLinks(companyInformation);

    return (
        <div className={twMerge('flex items-center gap-6', className)}>
            {facebook && (
                <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    aria-label="Facebook"
                    className={iconClassName}
                >
                    <Icons.Facebook className="w-6 h-6" />
                </a>
            )}
            {instagram && (
                <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    aria-label="Instagram"
                    className={iconClassName}
                >
                    <Icons.Instagram className="w-6 h-6" />
                </a>
            )}
            {linkedin && (
                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                    className={iconClassName}
                >
                    <Icons.Linkedin className="w-6 h-6" />
                </a>
            )}
            {pinterest && (
                <a
                    href={pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Pinterest"
                    aria-label="Pinterest"
                    className={iconClassName}
                >
                    <Icons.Pinterest className="w-6 h-6" />
                </a>
            )}
            {tiktok && (
                <a
                    href={tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok"
                    aria-label="TikTok"
                    className={iconClassName}
                >
                    <Icons.TikTok className="w-6 h-6" />
                </a>
            )}
            {twitter && (
                <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Twitter"
                    aria-label="Twitter"
                    className={iconClassName}
                >
                    <Icons.Twitter className="w-6 h-6" />
                </a>
            )}
            {youtube && (
                <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Youtube"
                    aria-label="Youtube"
                    className={iconClassName}
                >
                    <Icons.Youtube className="w-6 h-6" />
                </a>
            )}
        </div>
    );
}