import type { NewsroomGallery } from '@prezly/sdk';
import { Galleries, Uploads } from '@prezly/theme-kit-core';
import type { Metadata } from 'next';

import { type AsyncResolvable, resolveAsync } from '../../../utils';

import type { AppUrlGenerator, Prerequisites } from './types';
import { generatePageMetadata } from './utils';

export type Params = Prerequisites & {
    album: AsyncResolvable<NewsroomGallery>;
    generateUrl: AppUrlGenerator;
};

export async function generateMediaAlbumPageMetadata(
    { generateUrl, album: resolvableAlbum, ...prerequisites }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const album = await resolveAsync(resolvableAlbum);

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
