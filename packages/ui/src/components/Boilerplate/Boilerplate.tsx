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

export interface Props {
    className?: string;
    companyInformation: NewsroomCompanyInformation;
    externalSiteLink?: string;
}

export function Boilerplate({ className, companyInformation, externalSiteLink }: Props) {
    const { about, phone, email, address } = companyInformation;

    return (
        <div className={twMerge('py-12 px-6 md:p-12 bg-gray-800', className)}>
            {/* TODO: Add translations */}
            <h2 className="title-medium text-white">About</h2>
            <div className="flex flex-col md:grid gap-12 md:grid-cols-[3fr_1fr]">
                <div
                    className="mt-6 md:mb-12 text-white"
                    dangerouslySetInnerHTML={{ __html: about }}
                />

                <div className="flex flex-col w-full rounded border border-gray-700 h-max">
                    {externalSiteLink && (
                        <div className="p-6 border-b border-gray-700 last:border-b-0 gap-4 flex items-center">
                            <GlobeAltIcon className="w-4 h-4 text-white" />
                            <Link
                                className="text-white hover:text-white hover:underline"
                                href={externalSiteLink}
                                icon={ArrowUpRightIcon}
                                iconPlacement="right"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {new URL(externalSiteLink).hostname}
                            </Link>
                        </div>
                    )}
                    {phone && (
                        <div className="p-6 border-b border-gray-700 last:border-b-0 gap-4 flex items-center">
                            <DevicePhoneMobileIcon className="w-4 h-4 text-white" />
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
                            <EnvelopeIcon className="w-4 h-4 text-white" />
                            <Link
                                className="text-white hover:text-white hover:underline"
                                href={`mailto:${email}`}
                            >
                                {email}
                            </Link>
                        </div>
                    )}
                    {address && (
                        <div className="p-6 border-b border-gray-700 last:border-b-0 gap-4 flex items-center">
                            <MapPinIcon className="w-4 h-4 text-white" />
                            <p className="label-large text-white">{address}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
