import type { NewsroomGallery } from '@prezly/sdk';
import { DEFAULT_GALLERY_PAGE_SIZE } from '@prezly/theme-kit-core';
import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from 'next';

import type { PaginationProps } from '../../infinite-loading/types';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { getNewsroomStaticProps } from '../getNewsroomStaticProps';
import { processRequest } from '../processRequest';
import { processStaticRequest } from '../processStaticRequest';

import type { PropsFunction } from './lib/types';

export interface GalleryPageProps {
    galleries: NewsroomGallery[];
    pagination: PaginationProps;
}

interface Options {
    pageSize?: number;
}

export function getGalleryPageServerSideProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps>,
    options?: Options,
) {
    const { pageSize = DEFAULT_GALLERY_PAGE_SIZE } = options || {};

    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<GalleryPageProps & CustomProps>> {
        const { api, serverSideProps } = await getNewsroomServerSideProps(context);
        const { query } = context;

        const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;
        const { galleries, pagination } = await api.getGalleries({ page, pageSize });

        // If there's only one gallery, redirect to it immediately
        if (galleries.length === 1) {
            const { uuid } = galleries[0];

            return {
                redirect: {
                    destination: `/media/album/${uuid}`,
                    permanent: false,
                },
            };
        }

        return processRequest(
            context,
            {
                ...serverSideProps,
                galleries,
                pagination: {
                    itemsTotal: pagination.matched_records_number,
                    currentPage: page ?? 1,
                    pageSize,
                },
                ...(typeof customProps === 'function'
                    ? await (customProps as PropsFunction<CustomProps>)(context, serverSideProps)
                    : customProps),
            },
            '/media',
        );
    };
}

export function getGalleryPageStaticProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps, GetStaticPropsContext>,
    options?: Options,
) {
    const { pageSize = DEFAULT_GALLERY_PAGE_SIZE } = options || {};

    return async function getStaticProps(
        context: GetStaticPropsContext,
    ): Promise<GetStaticPropsResult<GalleryPageProps & CustomProps>> {
        const { api, staticProps } = await getNewsroomStaticProps(context);

        const { galleries, pagination } = await api.getGalleries({ pageSize });

        // If there's only one gallery, redirect to it immediately
        if (galleries.length === 1) {
            const { uuid } = galleries[0];

            return {
                redirect: {
                    destination: `/media/album/${uuid}`,
                    permanent: false,
                },
            };
        }

        return processStaticRequest(context, {
            ...staticProps,
            galleries,
            pagination: {
                itemsTotal: pagination.matched_records_number,
                currentPage: 1,
                pageSize,
            },
            ...(typeof customProps === 'function'
                ? await (customProps as PropsFunction<CustomProps, GetStaticPropsContext>)(
                      context,
                      staticProps,
                  )
                : customProps),
        });
    };
}
