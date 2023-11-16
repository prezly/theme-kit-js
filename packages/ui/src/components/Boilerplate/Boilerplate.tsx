import {
    ArrowUpRightIcon,
    DevicePhoneMobileIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';
import type { NewsroomCompanyInformation } from '@prezly/sdk';
import { twMerge } from 'tailwind-merge';

import { Link } from '../Link';

export function Boilerplate({ className, companyInformation, intl = {} }: Boilerplate.Props) {
    const { about, phone, email, address, website } = companyInformation;

    const hasContactInformation = Boolean(address || phone || email || website);

    if (!about && !phone && !email && !address && !website) {
        return null;
    }

    return (
        <div className={twMerge('py-12 px-6 md:p-12 bg-gray-800', className)}>
            <h2 className="title-medium text-white mb-6">{intl['boilerplate.title'] ?? 'About'}</h2>
            <div className="flex flex-col md:grid gap-12 md:grid-cols-[3fr_1fr]">
                {about && (
                    <div
                        className="md:mb-12 text-white"
                        dangerouslySetInnerHTML={{ __html: about }}
                    />
                )}

                {hasContactInformation && (
                    <div className="flex flex-col w-full md:max-w-xs rounded border border-gray-700 h-max">
                        {website && (
                            <div className="p-6 border-b border-gray-700 last:border-b-0 gap-4 flex items-center">
                                <GlobeAltIcon className="w-4 h-4 text-white shrink-0" />
                                <Link
                                    className="text-white hover:text-white hover:underline"
                                    href={website}
                                    icon={ArrowUpRightIcon}
                                    iconPlacement="right"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {new URL(website).hostname}
                                </Link>
                            </div>
                        )}
                        {phone && (
                            <div className="p-6 border-b border-gray-700 last:border-b-0 gap-4 flex items-center">
                                <DevicePhoneMobileIcon className="w-4 h-4 text-white shrink-0" />
                                <Link
                                    className="text-white hover:text-white hover:underline"
                                    href={`tel:${phone}`}
                                >
                                    {phone}
                                </Link>
                            </div>
                        )}
                        {email && (
                            <div className="p-6 border-b border-gray-700 last:border-b-0 gap-4 flex items-center">
                                <EnvelopeIcon className="w-4 h-4 text-white shrink-0" />
                                <Link
                                    className="text-white hover:text-white hover:underline"
                                    href={`mailto:${email}`}
                                >
                                    {email}
                                </Link>
                            </div>
                        )}
                        {address && (
                            <address className="p-6 border-b border-gray-700 last:border-b-0 gap-4 flex items-center not-italic">
                                <MapPinIcon className="w-4 h-4 text-white shrink-0" />
                                <p className="label-large text-white">{address}</p>
                            </address>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export namespace Boilerplate {
    export interface DisplayedInformation {
        about: NewsroomCompanyInformation['about'];
        phone: NewsroomCompanyInformation['phone'];
        email: NewsroomCompanyInformation['email'];
        address: NewsroomCompanyInformation['address'];
        website: NewsroomCompanyInformation['website'];
    }

    export interface Intl {
        ['boilerplate.title']: string;
    }

    export interface Props {
        className?: string;
        companyInformation: DisplayedInformation;
        intl?: Partial<Intl>;
    }
}
