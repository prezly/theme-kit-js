import { DevicePhoneMobileIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { UploadcareImage } from '@prezly/uploadcare-image';
import { twMerge } from 'tailwind-merge';

import { Icons } from '@/icons';

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
                    <a
                        className="label-large text-accent flex items-center gap-1"
                        href={`mailto:${email}`}
                    >
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>{email}</span>
                    </a>
                )}
                {phone && (
                    <a
                        className="label-large text-accent flex items-center gap-1"
                        href={`tel:${phone}`}
                    >
                        <PhoneIcon className="w-4 h-4" />
                        <span>{phone}</span>
                    </a>
                )}
                {mobile && (
                    <a
                        className="label-large text-accent flex items-center gap-1"
                        href={`tel:${mobile}`}
                    >
                        <DevicePhoneMobileIcon className="w-4 h-4" />
                        <span>{mobile}</span>
                    </a>
                )}
                {facebook && (
                    <a
                        className="label-large text-accent flex items-center gap-1"
                        href={`https://facebook.com/${facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icons.Facebook className="w-4 h-4" />
                        <span>{facebook}</span>
                    </a>
                )}
                {twitter && (
                    <a
                        className="label-large text-accent flex items-center gap-1"
                        href={`https://x.com/${twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icons.Twitter className="w-4 h-4" />
                        <span>@{twitter}</span>
                    </a>
                )}
            </div>
        </div>
    );
}
