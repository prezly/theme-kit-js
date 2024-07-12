/* eslint-disable @typescript-eslint/no-use-before-define */
import { NewsroomGallery } from '@prezly/sdk';
import { AsyncResolvable, Galleries, Uploads } from '@prezly/theme-kit-core';
import {
    formatMessageString,
    importDictionary,
    type IntlDictionary,
    type Locale,
    translations,
} from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import type { AbsoluteUrlGenerator, Prerequisites } from './types';
import { generatePageMetadata } from './utils';

export type Params = Prerequisites & {
    gallery: AsyncResolvable<NewsroomGallery>;
    generateUrl: AsyncResolvable<AbsoluteUrlGenerator>;
};

export async function generateMediaGalleryPageMetadata(
    { generateUrl: resolvableUrlGenerator, gallery: resolveGallery, ...prerequisites }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const { locale } = prerequisites;
    const [generateUrl, gallery] = await AsyncResolvable.resolve(
        resolvableUrlGenerator,
        resolveGallery,
    );

    const dictionary = await importDictionary(locale);

    const title = `${formatMessageString(locale, translations.mediaGallery.titleSingular, dictionary)}: ${gallery.name}`;
    const description = generateDescription(locale, dictionary, gallery);
    const thumbnail = Galleries.getCoverImage(gallery);
    const imageUrl = thumbnail ? Uploads.getCdnUrl(thumbnail.uuid) : undefined;

    return generatePageMetadata(
        {
            ...prerequisites,
            title,
            description,
            imageUrl,
            generateUrl: (localeCode) => generateUrl('mediaGallery', { ...gallery, localeCode }),
        },
        ...metadata,
    );
}

export namespace generateMediaGalleryPageMetadata {
    export type Parameters = Params;
}

function generateDescription(
    locale: Locale.Code,
    dictionary: IntlDictionary,
    gallery: NewsroomGallery,
) {
    const description = gallery.description?.trim() ?? '';

    if (gallery.type === NewsroomGallery.Type.IMAGE) {
        const imagesCount = formatMessageString(
            locale,
            translations.mediaGallery.imagesCount,
            dictionary,
            {
                imagesCount: gallery.images_number,
            },
        );

        return [imagesCount, description].filter(Boolean).join(' - ');
    }

    if (gallery.type === NewsroomGallery.Type.VIDEO) {
        const videosCount = formatMessageString(
            locale,
            translations.mediaGallery.videosCount,
            dictionary,
            { videosCount: gallery.videos_number },
        );
        return [videosCount, description].filter(Boolean).join(' - ');
    }

    return description;
}
