import type { NewsroomGallery } from '@prezly/sdk';
import { AsyncResolvable, Galleries, Uploads } from '@prezly/theme-kit-core';
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
    const [generateUrl, gallery] = await AsyncResolvable.resolve(
        resolvableUrlGenerator,
        resolveGallery,
    );

    const thumbnail = Galleries.getCoverImage(gallery);
    const imageUrl = thumbnail ? Uploads.getCdnUrl(thumbnail.uuid) : undefined;

    return generatePageMetadata(
        {
            ...prerequisites,
            title: gallery.name,
            imageUrl,
            generateUrl: (localeCode) => generateUrl('mediaGallery', { ...gallery, localeCode }),
        },
        ...metadata,
    );
}

export namespace generateMediaGalleryPageMetadata {
    export type Parameters = Params;
}
