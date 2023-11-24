import type { NewsroomGallery } from '@prezly/sdk';
import { Galleries, Uploads } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { type AsyncResolvable, resolveAsync } from '../../../utils';

import type { Prerequisites, Url } from './types';
import { generatePageMetadata } from './utils';

export type Params = Prerequisites & {
    album: AsyncResolvable<NewsroomGallery>;
    generateUrl?: (locale: Locale.Code, album: NewsroomGallery) => Url | undefined;
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
            generateUrl: (localeCode) => generateUrl?.(localeCode, album),
        },
        ...metadata,
    );
}

export namespace generateMediaAlbumMetadata {
    export type Parameters = Params;
}
