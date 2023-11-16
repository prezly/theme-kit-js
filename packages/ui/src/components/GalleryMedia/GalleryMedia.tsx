import { ArrowRightIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import type { NewsroomGallery } from '@prezly/sdk';
import type { UploadedImage } from '@prezly/uploadcare';
import { UploadcareImage } from '@prezly/uploadcare-image';
import { twMerge } from 'tailwind-merge';

import { Link } from '../Link';

export function GalleryMedia({ gallery, className, intl = {} }: GalleryMedia.Props) {
    const { cover, images, videos, href, name } = gallery;
    return (
        <Link
            href={href}
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
                    {(images > 0 || videos > 0) && (
                        <div className="flex items-center gap-3">
                            {images > 0 && (
                                <span className="flex text-gray-100">
                                    <PhotoIcon className="w-5 h-5 mr-2" />
                                    {videos === 0
                                        ? // FIXME: use interpolated i18n string here
                                          `${images} ${intl['images.title'] ?? 'Images'}`
                                        : images}
                                </span>
                            )}
                            {videos > 0 && (
                                <span className="flex text-gray-100">
                                    <VideoCameraIcon className="w-5 h-5 mr-2" />
                                    {images === 0
                                        ? // FIXME: use interpolated i18n string here
                                          `${videos} ${intl['videos.title'] ?? 'Videos'}`
                                        : videos}
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

    export interface DisplayedGallery {
        name: NewsroomGallery['name'];
        images: NewsroomGallery['images_number'];
        videos: NewsroomGallery['videos_number'];
        cover?: UploadedImage | null;
        href: `/${string}`;
    }

    export interface Props {
        gallery: DisplayedGallery;
        className?: string;
        intl?: Partial<Intl>;
    }
}
