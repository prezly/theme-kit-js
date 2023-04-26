import type { NewsroomGallery } from '@prezly/sdk';
import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPathsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from 'next';

import { getNextPrezlyApi } from '../../data-fetching/index.js';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps.js';
import { getNewsroomStaticProps } from '../getNewsroomStaticProps.js';
import { processRequest } from '../processRequest.js';
import { processStaticRequest } from '../processStaticRequest.js';

import type { PropsFunction } from './lib/types';

export interface GalleryAlbumPageProps {
    gallery: NewsroomGallery;
}

export function getGalleryAlbumPageServerSideProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps>,
) {
    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<GalleryAlbumPageProps & CustomProps>> {
        const { api, serverSideProps } = await getNewsroomServerSideProps(context);

        const { uuid } = context.params as { uuid: string };
        const gallery = await api.getGallery(uuid);

        if (!gallery || !gallery.images_number) {
            return { notFound: true };
        }

        return processRequest(
            context,
            {
                ...serverSideProps,
                gallery,
                ...(typeof customProps === 'function'
                    ? await (customProps as PropsFunction<CustomProps>)(context, serverSideProps)
                    : customProps),
            },
            `/media/album/${uuid}`,
        );
    };
}

export function getGalleryAlbumPageStaticProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps, GetStaticPropsContext>,
) {
    return async function getStaticProps(
        context: GetStaticPropsContext,
    ): Promise<GetStaticPropsResult<GalleryAlbumPageProps & CustomProps>> {
        const { api, staticProps } = await getNewsroomStaticProps(context);

        const { uuid } = context.params as { uuid: string };
        const gallery = await api.getGallery(uuid);

        if (!gallery || !gallery.images_number) {
            return { notFound: true };
        }

        return processStaticRequest(context, {
            ...staticProps,
            gallery,
            ...(typeof customProps === 'function'
                ? await (customProps as PropsFunction<CustomProps, GetStaticPropsContext>)(
                      context,
                      staticProps,
                  )
                : customProps),
        });
    };
}

export async function getGalleryAlbumPageStaticPaths(): Promise<GetStaticPathsResult> {
    const api = getNextPrezlyApi();
    const { galleries } = await api.getGalleries({});

    const paths = galleries.map(({ uuid }) => ({ params: { uuid } }));

    return {
        paths,
        fallback: 'blocking',
    };
}
