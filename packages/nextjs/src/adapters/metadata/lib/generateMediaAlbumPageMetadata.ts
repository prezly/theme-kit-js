import type { NewsroomGallery } from '@prezly/sdk';
import { AsyncResolvable, Galleries, Uploads } from '@prezly/theme-kit-core';
import type { Metadata } from 'next';

import type { AppUrlGenerator, Prerequisites } from './types';
import { generatePageMetadata } from './utils';

export type Params = Prerequisites & {
    album: AsyncResolvable<NewsroomGallery>;
    generateUrl: AsyncResolvable<AppUrlGenerator>;
};

export async function generateMediaAlbumPageMetadata(
    { generateUrl: resolvableUrlGenerator, album: resolvableAlbum, ...prerequisites }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const [generateUrl, album] = await AsyncResolvable.resolve(
        resolvableUrlGenerator,
        resolvableAlbum,
    );

    const thumbnail = Galleries.getCoverImage(album);
    const imageUrl = thumbnail ? Uploads.getCdnUrl(thumbnail.uuid) : undefined;

    return generatePageMetadata(
        {
            ...prerequisites,
            title: album.title,
            imageUrl,
            generateUrl: (localeCode) => generateUrl('mediaAlbum', { ...album, localeCode }),
        },
        ...metadata,
    );
}

export namespace generateMediaAlbumPageMetadata {
    export type Parameters = Params;
}
