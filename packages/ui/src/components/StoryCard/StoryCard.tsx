import type { Culture, UploadedImage } from '@prezly/sdk';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import type { AlgoliaStory, StoryWithImage } from '@/types';

import { CategoriesList } from '../CategoriesList';
import { StoryPublicationDate } from '../StoryPublicationDate';

import { StoryImage, type StoryImageSize } from './components';

export function StoryCard({
    story,
    categories = [],
    dateFormat,
    showDate,
    locale,
    newsroomName,
    logo,
    size = 'large',
    hideSubtitle,
    className,
}: StoryCard.Props) {
    const { slug, title, subtitle } = story;

    return (
        <div
            className={twMerge(
                'flex flex-row items-center p-0 bg-white group sm:max-w-[530px]',
                size === 'large' ? `flex-col gap-0` : `md:flex-row sm:max-w-none items-start gap-4`,
                className,
            )}
        >
            <Link
                className={twMerge(
                    'aspect-[10/7]',
                    size === 'large'
                        ? 'w-full md:aspect-[27/17]'
                        : 'w-1/3 hidden md:block md:max-w-[200px]',
                )}
                href={`/${slug}`}
                locale={false}
            >
                <StoryImage
                    className="cursor-pointer"
                    logo={logo}
                    newsroomName={newsroomName}
                    placeholderClassName=""
                    size={size}
                    story={story}
                />
            </Link>
            <div
                className={twMerge(
                    size === 'large'
                        ? `p-6 md:py-6 md:px-0 w-full`
                        : `py-1 md:py-1 w-full md:w-2/3`,
                )}
            >
                <div className="flex flex-wrap items-center gap-1">
                    {showDate && (
                        <span className="label-large text-gray-500 shrink-0">
                            <StoryPublicationDate locale={locale} dateFormat={dateFormat} />
                        </span>
                    )}
                    {categories.length > 0 && (
                        <>
                            <span className="label-large text-gray-500">·</span>
                            <CategoriesList categories={categories} />
                        </>
                    )}
                </div>
                <div className="mt-4">
                    <Link href={`/${slug}`} locale={false}>
                        <h2
                            className={twMerge(
                                'cursor-pointer',
                                size === 'large' ? 'title-small ' : 'title-xx-small',
                                'group-hover:text-gray-950',
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
                                'group-hover:text-gray-950',
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

export namespace StoryCard {
    export type DisplayedCategory = CategoriesList.DisplayedCategory;

    export interface Props {
        story: StoryWithImage | AlgoliaStory;
        categories?: StoryCard.DisplayedCategory[];
        locale: Culture['code'];
        size?: StoryImageSize;
        newsroomName: string;
        logo?: UploadedImage | null;
        showDate?: boolean;
        hideSubtitle?: boolean;
        className?: string;
        dateFormat?: string;
    }
}
