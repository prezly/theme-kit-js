import { ArrowRightIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import type { Culture, NewsroomGallery } from '@prezly/sdk';
import { getGalleryThumbnail } from '@prezly/theme-kit-core';
import { UploadcareImage } from '@prezly/uploadcare-image';
import { twMerge } from 'tailwind-merge';

import { Link } from '../Link';

export interface Props {
    className?: string;
    gallery: NewsroomGallery;
    locale?: Culture['code'];
}

export function GalleryMedia({ className, gallery, locale }: Props) {
    const { name, images_number, videos_number, uuid } = gallery;
    const cover = getGalleryThumbnail(gallery);

    return (
        <Link
            href={`/media/album/${uuid}`}
            className={twMerge('relative w-full md:w-max group', className)}
            contentClassName="p-0"
            localeCode={locale}
        >
            {cover && (
                <UploadcareImage
                    className={twMerge(
                        'aspect-[17/12] md:aspect-[6/7] w-full max-w-full md:max-w-[258px]',
                        'transition-transform group-hover:transform group-hover:scale-[1.05]',
                    )}
                    lazy
                    layout="fill"
                    objectFit="cover"
                    imageDetails={cover}
                />
            )}
            <div
                className={twMerge(
                    'absolute inset-0',
                    'bg-[linear-gradient(180deg,rgba(39,39,42,0.00)_0%,rgba(39,39,42,0.32)_54.69%,rgba(39,39,42,0.48)_78.12%,rgba(39,39,42,0.60)_100%)]',
                    'flex flex-col justify-end p-6 gap-2',
                    'transition-transform group-hover:transform group-hover:scale-[1.05]',
                )}
            >
                <p className="title-x-small text-gray-100">{name}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {Boolean(images_number) && (
                            <span className="flex text-gray-100">
                                <PhotoIcon className="w-5 h-5 mr-2" />
                                {/* TODO: Add translations */}
                                {videos_number === 0 ? `${images_number} Images` : images_number}
                            </span>
                        )}
                        {Boolean(videos_number) && (
                            <span className="flex text-gray-100">
                                <VideoCameraIcon className="w-5 h-5 mr-2" />
                                {/* TODO: Add translations */}
                                {images_number === 0 ? `${videos_number} Videos` : videos_number}
                            </span>
                        )}
                    </div>

                    <ArrowRightIcon className="w-5 h-5 text-white" />
                </div>
            </div>
        </Link>
    );
}
