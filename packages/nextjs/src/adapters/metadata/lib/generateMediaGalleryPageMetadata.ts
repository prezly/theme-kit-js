import { NewsroomGallery } from '@prezly/sdk';
import { AsyncResolvable, Galleries, Uploads } from '@prezly/theme-kit-core';
import { formatMessageString, importDictionary, translations } from '@prezly/theme-kit-intl';
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

    let { description } = gallery;
    if (gallery.type === NewsroomGallery.Type.IMAGE) {
        description = `${formatMessageString(
            locale,
            translations.mediaGallery.imagesCount,
            dictionary,
            { imagesCount: gallery.images_number },
        )} - ${gallery.description}`;
    }

    if (gallery.type === NewsroomGallery.Type.VIDEO) {
        description = `${formatMessageString(
            locale,
            translations.mediaGallery.videosCount,
            dictionary,
            { videosCount: gallery.videos_number },
        )} - ${gallery.description}`;
    }

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
