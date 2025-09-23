import { Story } from '@prezly/sdk';
import type { StoryRef } from '@prezly/sdk';
import { AsyncResolvable } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import type { AbsoluteUrlGenerator, Prerequisites } from './types';
import { generatePageMetadata } from './utils';

export type Params = Omit<Prerequisites, 'locale'> & {
    story: AsyncResolvable<Story>;
    isPreview?: boolean;
    isSecret?: boolean;

    generateUrl: AsyncResolvable<AbsoluteUrlGenerator>;
};

export async function generateStoryPageMetadata(
    {
        isPreview = false,
        isSecret = false,
        generateUrl: resolvableUrlGenerator,
        ...resolvable
    }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const [generateUrl, story] = await AsyncResolvable.resolve(
        resolvableUrlGenerator,
        resolvable.story,
    );

    function generateStoryUrl(localeCode: Locale.Code, translation: StoryRef) {
        if (Story.isPublished(translation)) {
            return generateUrl?.('story', { ...translation, localeCode });
        }
        return undefined;
    }

    const { author, oembed } = story;

    const locale = story.culture.code;
    const authorName = author?.display_name || author?.email;

    const isEmbargoStory = story.visibility === Story.Visibility.EMBARGO;
    const isPrivateStory = story.visibility === Story.Visibility.PRIVATE;
    const isConfidentialStory = story.visibility === Story.Visibility.CONFIDENTIAL;

    const title =
        story.seo_settings.meta_title || story.seo_settings.default_meta_title || story.title;

    const description =
        story.seo_settings.meta_description ||
        story.seo_settings.default_meta_description ||
        story.subtitle ||
        story.summary;

    const canonical = story.seo_settings.canonical_url || oembed.url;

    return generatePageMetadata(
        {
            ...resolvable,
            locale,
            imageUrl: oembed.thumbnail_url,
            title: isPreview ? `[Preview]: ${title}` : title,
            description,
            generateUrl: (localeCode) => {
                const target = [story, ...story.translations].find(
                    (translation) => translation.culture.code === localeCode,
                );
                if (target) {
                    return generateStoryUrl(localeCode, target);
                }
                return undefined;
            },
        },
        {
            alternates: {
                canonical,
                types: Story.isPublished(story)
                    ? { ['application/json']: `${oembed.url}.json` }
                    : undefined,
            },
            robots:
                isPreview || isSecret || isPrivateStory || isEmbargoStory || isConfidentialStory
                    ? { index: false, follow: false }
                    : undefined,
            openGraph: {
                title: story.title,
                description,
                url: oembed.url,
                type: 'article',
                publishedTime: story.published_at ?? undefined,
                modifiedTime: story.updated_at,
                authors: authorName ? [authorName] : undefined,
                images: oembed.thumbnail_url && [
                    {
                        url: oembed.thumbnail_url,
                        alt: oembed.title,
                        width: oembed.width,
                        height: oembed.height,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
            },
        },
        ...metadata,
    );
}

export namespace generateStoryPageMetadata {
    export type Parameters = Params;
}
