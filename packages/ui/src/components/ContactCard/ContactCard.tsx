import { DevicePhoneMobileIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { UploadcareImage } from '@prezly/uploadcare-image';
import { twMerge } from 'tailwind-merge';

import { Icons } from '@/icons';

import { Link } from '../Link';

import type { ContactInfo } from './type';
import { getSocialHandles } from './utils';

export interface Props {
    contactInfo: ContactInfo;
    className?: string;
}

export function ContactCard({ contactInfo, className }: Props) {
    const { avatar_image, description, company, name, email, phone, mobile } = contactInfo;
    const subtitle = description && company ? `${description}, ${company}` : description;
    const { facebook, twitter } = getSocialHandles(contactInfo);

    return (
        <div
            className={twMerge(
                'flex p-6 border border-gray-200 flex-col gap-4 max-w-xl rounded',
                className,
            )}
        >
            <div className="flex items-center gap-4">
                {avatar_image && (
                    <UploadcareImage
                        className="w-16 h-16 rounded"
                        layout="fixed"
                        imageDetails={avatar_image}
                    />
                )}
                <div className="flex flex-col gap-1">
                    <h4 className="title-x-small">{name}</h4>
                    <p className="label-large text-gray-600">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-4">
                {email && (
                    <Link forceRefresh href={`mailto:${email}`} icon={EnvelopeIcon}>
                        {email}
                    </Link>
                )}
                {phone && (
                    <Link forceRefresh href={`tel:${phone}`} icon={PhoneIcon}>
                        {phone}
                    </Link>
                )}
                {mobile && (
                    <Link forceRefresh href={`tel:${mobile}`} icon={DevicePhoneMobileIcon}>
                        {mobile}
                    </Link>
                )}
                {facebook && (
                    <Link
                        forceRefresh
                        href={`https://facebook.com/${facebook}`}
                        icon={Icons.Facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {facebook}
                    </Link>
                )}
                {twitter && (
                    <Link
                        forceRefresh
                        href={`https://x.com/${twitter}`}
                        icon={Icons.Twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        @{twitter}
                    </Link>
                )}
            </div>
        </div>
    );
}
