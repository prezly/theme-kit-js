import { DevicePhoneMobileIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import type { NewsroomContact } from '@prezly/sdk';
import { UploadcareImage } from '@prezly/uploadcare-image';
import { twMerge } from 'tailwind-merge';

import { Icons } from '@/icons';

import { Link } from '../Link';

import { getSocialHandles } from './utils';

export function ContactCard({ contact, className }: ContactCard.Props) {
    const { avatar_image, avatar_url, description, company, name, email, phone, mobile } = contact;
    const subtitle = description && company ? `${description}, ${company}` : description;
    const { facebook, twitter } = getSocialHandles(contact);

    return (
        <div
            className={twMerge(
                'flex p-6 border border-gray-200 flex-col gap-4 max-w-xl rounded',
                className,
            )}
        >
            <div className="flex items-center gap-4">
                {avatar_image ? (
                    <UploadcareImage
                        className="w-16 h-16 rounded"
                        layout="fixed"
                        imageDetails={avatar_image}
                    />
                ) : (
                    avatar_url && (
                        <UploadcareImage
                            className="w-16 h-16 rounded"
                            layout="fixed"
                            src={avatar_url}
                        />
                    )
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

export namespace ContactCard {
    export interface DisplayedContact {
        avatar_image: NewsroomContact['avatar_image'];
        name: NewsroomContact['name'];
        description: NewsroomContact['description'];
        company: NewsroomContact['company'];
        email: NewsroomContact['email'];
        phone: NewsroomContact['phone'];
        mobile: NewsroomContact['mobile'];
        website: NewsroomContact['website'];
        facebook: NewsroomContact['facebook'];
        twitter: NewsroomContact['twitter'];
        avatar_url?: string | null;
    }

    export interface Props {
        contact: DisplayedContact;
        className?: string;
    }
}
