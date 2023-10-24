import type { Culture, UploadedImage } from '@prezly/sdk';
import Link from 'next/link';

import type { StoryWithImage } from '@/types';

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
}

export function Hero({
    story,
    showDate,
    locale,
    newsroomName,
    logo,
    size = 'default',
    hideSubtitle,
}: Props) {
    const { slug, categories, title, subtitle } = story;

    return (
        <div className="flex flex-col md:flex-row items-center p-0 md:p-12 bg-white gap-0 md:gap-12 group">
            <Link href={`/${slug}`} locale={false} legacyBehavior>
                <div className="w-full md:w-1/2">
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
            <div className="w-full md:w-1/2 p-6 md:p-0">
                <div className="flex items-center gap-1">
                    {showDate && (
                        <span className="label-large text-gray-500">
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
                </div>
            </div>
        </div>
    );
}
