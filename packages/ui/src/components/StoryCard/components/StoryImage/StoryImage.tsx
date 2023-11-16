import type { UploadedImage } from '@prezly/sdk';
import type { AlgoliaStory } from '@prezly/theme-kit-core';
import Image from '@prezly/uploadcare-image';
import { twMerge } from 'tailwind-merge';

import { getStoryThumbnail } from '@/lib';
import type { StoryWithImage } from '@/types';

import { getHeroImageSizes } from './lib';

export type StoryImageSize = 'large' | 'tiny';

type Props = {
    story: StoryWithImage | AlgoliaStory;
    size: StoryImageSize;
    className?: string;
    placeholderClassName?: string;
    newsroomName: string;
    logo?: UploadedImage | null;
};

export function StoryImage({
    story,
    size,
    className,
    placeholderClassName,
    newsroomName,
    logo,
}: Props) {
    const image = getStoryThumbnail(story);

    if (image) {
        return (
            <Image
                imageDetails={image}
                alt={story.title}
                layout="fill"
                objectFit="cover"
                containerClassName={twMerge(`block h-full md:rounded`)}
                className={twMerge(
                    `block h-full w-full md:rounded transition ease-out duration-[300ms] group-hover:transform group-hover:scale-[1.02] group-hover:shadow-xLarge`,
                    className,
                )}
                sizes={getHeroImageSizes(size)}
            />
        );
    }

    return (
        <span
            className={twMerge(
                `h-full flex items-center justify-center p-6 bg-placeholder text-center text-large font-bold md:rounded text-header-link`,
                `transition ease-out duration-[300ms] group-hover:transform group-hover:scale-[1.02] group-hover:shadow-xLarge`,
                placeholderClassName,
            )}
        >
            {logo && (
                <Image
                    imageDetails={logo}
                    layout="fill"
                    objectFit="contain"
                    alt="No image"
                    className={twMerge(`block h-full w-full md:rounded`, `bg-gray-100`, className)}
                    sizes={{ default: 256 }}
                />
            )}
            {!logo && newsroomName}
        </span>
    );
}
