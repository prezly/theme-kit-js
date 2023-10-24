import type { Culture, UploadedImage } from '@prezly/sdk';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import type { StoryWithImage } from '@/types';

import { CategoriesList } from '../CategoriesList';
import { StoryPublicationDate } from '../StoryPublicationDate';

import { StoryImage, type StoryImageSize } from './components';

export interface Props {
    story: StoryWithImage;
    locale: Culture['code'];
    size?: StoryImageSize;
    newsroomName: string;
    logo?: UploadedImage | null;
    showDate?: boolean;
    hideSubtitle?: boolean;
    className?: string;
}

export function StoryCard({
    story,
    showDate,
    locale,
    newsroomName,
    logo,
    size = 'large',
    hideSubtitle,
    className,
}: Props) {
    const { slug, categories, title, subtitle } = story;

    return (
        <div
            className={twMerge(
                'flex flex-row items-center p-0 bg-white group sm:max-w-[530px]',
                size === 'large' ? `flex-col gap-0` : `md:flex-row items-start gap-4`,
                className,
            )}
        >
            <Link href={`/${slug}`} locale={false} legacyBehavior>
                <div
                    className={twMerge(
                        size === 'large'
                            ? 'w-full aspect-[20/14] md:aspect-[27/17]'
                            : 'w-1/3 aspect-[10/7] hidden md:block',
                    )}
                >
                    <StoryImage
                        className="cursor-pointer"
                        logo={logo}
                        newsroomName={newsroomName}
                        placeholderClassName=""
                        size={size}
                        story={story}
                    />
                </div>
            </Link>
            <div
                className={twMerge(
                    size === 'large' ? `p-6 md:py-6 md:px-0 w-full` : `py-1 md:p-0 w-full md:w-2/3`,
                )}
            >
                <div className="flex flex-wrap items-center gap-1">
                    {showDate && (
                        <span className="label-large text-gray-500 shrink-0">
                            <StoryPublicationDate locale={locale} story={story} />
                        </span>
                    )}
                    {Boolean(categories.length) && (
                        <>
                            <span className="label-large text-gray-500">·</span>
                            <CategoriesList categories={categories} locale={locale} />
                        </>
                    )}
                </div>
                <div className="mt-4">
                    <Link href={`/${slug}`} locale={false} legacyBehavior>
                        <h2
                            className={twMerge(
                                'cursor-pointer',
                                size === 'large' ? 'title-small ' : 'title-xx-small',
                            )}
                        >
                            {title}
                        </h2>
                    </Link>
                    {Boolean(!hideSubtitle && subtitle) && (
                        <p
                            className={twMerge(
                                'mt-3 text-ellipsis',
                                size === 'large'
                                    ? 'subtitle-small line-clamp-3'
                                    : 'label-large font-medium text-gray-800 line-clamp-2',
                            )}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
