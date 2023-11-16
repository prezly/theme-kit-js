import { ArrowRightIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import type { NewsroomGallery } from '@prezly/sdk';
import type { UploadedImage } from '@prezly/uploadcare';
import { UploadcareImage } from '@prezly/uploadcare-image';
import { twMerge } from 'tailwind-merge';

import { Link } from '../Link';

export function GalleryMedia({
    className,
    cover,
    name,
    galleryHref,
    imagesNumber,
    videosNumber,
    intl = {},
}: GalleryMedia.Props) {
    return (
        <Link
            href={galleryHref}
            className={twMerge(
                'relative w-full md:w-max transition-transform duration-300 hover:scale-[1.02] hover:shadow-xLarge',
                className,
            )}
            contentClassName="p-0"
        >
            {cover && (
                <UploadcareImage
                    className="aspect-[17/12] md:aspect-[6/7] w-full max-w-full md:max-w-[256px]"
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
                    {Boolean(imagesNumber || videosNumber) && (
                        <div className="flex items-center gap-3">
                            {Boolean(imagesNumber) && (
                                <span className="flex text-gray-100">
                                    <PhotoIcon className="w-5 h-5 mr-2" />
                                    {videosNumber === 0
                                        ? `${imagesNumber} ${intl['images.title'] ?? 'Images'}`
                                        : imagesNumber}
                                </span>
                            )}
                            {Boolean(videosNumber) && (
                                <span className="flex text-gray-100">
                                    <VideoCameraIcon className="w-5 h-5 mr-2" />
                                    {imagesNumber === 0
                                        ? `${videosNumber} ${intl['videos.title'] ?? 'Videos'}`
                                        : videosNumber}
                                </span>
                            )}
                        </div>
                    )}

                    <ArrowRightIcon className="w-5 h-5 text-white" />
                </div>
            </div>
        </Link>
    );
}

export namespace GalleryMedia {
    export interface Intl {
        ['videos.title']: string;
        ['images.title']: string;
    }

    export interface Props {
        galleryHref: `/${string}`;
        name: NewsroomGallery['name'];
        className?: string;
        imagesNumber: NewsroomGallery['images_number'];
        videosNumber: NewsroomGallery['videos_number'];
        cover?: UploadedImage | null;
        intl?: Partial<Intl>;
    }
}
