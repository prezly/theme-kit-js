import type { UploadedImage } from '@prezly/sdk';
import type { AlgoliaStory } from '@prezly/theme-kit-core';
import Image from '@prezly/uploadcare-image';
import { twMerge } from 'tailwind-merge';

import { getStoryThumbnail } from '@/lib';
import type { StoryWithImage } from '@/types';

import { getHeroImageSizes } from './lib';

export type HeroImageSize = 'large' | 'default';

type Props = {
    story: StoryWithImage | AlgoliaStory;
    size: HeroImageSize;
    className?: string;
    placeholderClassName?: string;
    newsroomName: string;
    logo?: UploadedImage | null;
};

export function HeroImage({
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
                containerClassName={twMerge(`block h-full sm:rounded`)}
                className={twMerge(
                    `block h-full sm:rounded transition-transform ease-out duration-[250ms] group-hover:transform group-hover:scale-[1.05]`,
                    className,
                )}
                sizes={getHeroImageSizes(size)}
            />
        );
    }

    return (
        <span className={twMerge(``, placeholderClassName)}>
            {logo && (
                <Image
                    imageDetails={logo}
                    layout="fill"
                    objectFit="contain"
                    alt="No image"
                    className={twMerge(``, ``, className)}
                    sizes={{ default: 256 }}
                />
            )}
            {!logo && newsroomName}
        </span>
    );
}
