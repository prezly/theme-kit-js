import type { NewsroomGallery } from '@prezly/sdk';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { processRequest } from '../processRequest';

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
