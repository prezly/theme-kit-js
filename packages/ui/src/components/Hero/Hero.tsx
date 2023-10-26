import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Culture, UploadedImage } from '@prezly/sdk';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import type { StoryWithImage } from '@/types';

import { ButtonLink } from '../Button';
import { CategoriesList } from '../CategoriesList';
import { StoryPublicationDate } from '../StoryPublicationDate';

import { HeroImage, type HeroImageSize } from './components';

export interface Props {
    story: StoryWithImage;
    locale: Culture['code'];
    size?: HeroImageSize;
    newsroomName: string;
    logo?: UploadedImage | null;
    showDate?: boolean;
    hideSubtitle?: boolean;
    className?: string;
}

export function Hero({
    story,
    showDate,
    locale,
    newsroomName,
    logo,
    size = 'default',
    hideSubtitle,
    className,
}: Props) {
    const { slug, categories, title, subtitle } = story;

    return (
        <div
            className={twMerge(
                'flex flex-col items-center p-0 bg-white gap-0 md:gap-12 group',
                size === 'large' ? `md:flex-row-reverse` : `md:flex-row md:p-12`,
                className,
            )}
        >
            <Link href={`/${slug}`} locale={false} legacyBehavior>
                <div
                    className={twMerge(
                        'w-full md:w-1/2',
                        size === 'large' ? 'aspect-[30/30]' : 'aspect-[27/17]',
                    )}
                >
                    <HeroImage
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
                    'w-full md:w-1/2',
                    size === 'large' ? `p-6 md:px-12 md:py-20` : `p-6 md:p-0`,
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
                        <h2 className="title-medium cursor-pointer">{title}</h2>
                    </Link>
                    {Boolean(!hideSubtitle && subtitle) && (
                        <p className="subtitle-medium mt-3 line-clamp-3 text-ellipsis">
                            {subtitle}
                        </p>
                    )}
                    <ButtonLink
                        className={twMerge('mt-6 w-max', size === 'default' && `md:hidden`)}
                        href={`/${slug}`}
                        localeCode={false}
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        size="small"
                        variation="primary"
                    >
                        Read more
                    </ButtonLink>
                </div>
            </div>
        </div>
    );
}
