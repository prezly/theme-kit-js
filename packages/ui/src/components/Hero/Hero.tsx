import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Culture, Story, UploadedImage } from '@prezly/sdk';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { ButtonLink } from '../Button';
import { CategoriesList } from '../CategoriesList';
import { StoryPublicationDate } from '../StoryPublicationDate';

import { HeroImage } from './components';

export function Hero({
    story,
    categories = [],
    showDate,
    locale,
    dateFormat,
    newsroomName,
    logo,
    size = 'default',
    hideSubtitle,
    className,
}: Hero.Props) {
    const { href, title, subtitle } = story;

    return (
        <div
            className={twMerge(
                'flex flex-col items-center p-0 bg-white gap-0 md:gap-12 group',
                size === 'large' ? `md:flex-row-reverse` : `md:flex-row md:p-12`,
                className,
            )}
        >
            <Link
                className={twMerge(
                    'w-full md:w-1/2',
                    size === 'large' ? 'aspect-[30/30]' : 'aspect-[27/17]',
                )}
                href={href}
                locale={false}
            >
                <HeroImage
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
                    'w-full md:w-1/2',
                    size === 'large' ? `p-6 md:px-12 md:py-20` : `p-6 md:p-0`,
                )}
            >
                <div className="flex flex-wrap items-center gap-1">
                    {showDate && (
                        <span className="label-large text-gray-500 shrink-0">
                            <StoryPublicationDate dateFormat={dateFormat} locale={locale} />
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
                    <Link href={href} locale={false}>
                        <h2 className="title-medium cursor-pointer group-hover:text-gray-950">
                            {title}
                        </h2>
                    </Link>
                    {Boolean(!hideSubtitle && subtitle) && (
                        <p className="subtitle-medium mt-3 line-clamp-3 text-ellipsis group-hover:text-gray-950">
                            {subtitle}
                        </p>
                    )}
                    <ButtonLink
                        className={twMerge('mt-6 w-max', size === 'default' && `md:hidden`)}
                        href={href}
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

export namespace Hero {
    export type DisplayedCategory = CategoriesList.DisplayedCategory;

    export interface DisplayedStory extends HeroImage.DisplayedStory {
        subtitle: Story['subtitle'];
        href: string;
    }

    export interface Props {
        story: DisplayedStory;
        categories?: Hero.DisplayedCategory[];
        locale: Culture['code'];
        size?: HeroImage.Size;
        newsroomName: string;
        logo?: UploadedImage | null;
        showDate?: boolean;
        hideSubtitle?: boolean;
        className?: string;
        dateFormat?: string;
    }
}
